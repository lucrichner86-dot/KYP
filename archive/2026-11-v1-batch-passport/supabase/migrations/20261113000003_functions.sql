-- Every state change is one of these functions, called from the app via RPC.
-- They run as the owner (security definer), check the caller themselves, and
-- are the only way rows get written.

-- ---------------------------------------------------------------- helpers

create function public.kyp_require_member(p_producer_id uuid)
returns void
language plpgsql stable security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Sign in first.' using errcode = '42501';
  end if;
  if p_producer_id is null or not public.is_producer_member(p_producer_id) then
    raise exception 'Not found, or not yours to change.' using errcode = '42501';
  end if;
end;
$$;

-- Locks the batch row, checks membership and returns it.
create function public.kyp_batch_for_update(p_batch_id uuid)
returns public.batches
language plpgsql security definer set search_path = ''
as $$
declare
  v_batch public.batches;
begin
  select * into v_batch from public.batches where id = p_batch_id for update;
  perform public.kyp_require_member(v_batch.producer_id);
  return v_batch;
end;
$$;

-- 20 characters of Crockford base32 (100 random bits).
create function public.kyp_new_passport_code()
returns text
language sql volatile set search_path = ''
as $$
  select string_agg(substr('0123456789abcdefghjkmnpqrstvwxyz', get_byte(s.h, i) % 32 + 1, 1), '')
  from (select sha256(uuid_send(gen_random_uuid()) || uuid_send(gen_random_uuid())) as h) s,
       generate_series(0, 19) i;
$$;

-- ---------------------------------------------------------------- producer

create function public.create_producer(p_name text, p_country text, p_website text default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
  v_id uuid;
begin
  if v_user is null then
    raise exception 'Sign in first.' using errcode = '42501';
  end if;
  -- Version one: one producer per account.
  if exists (select 1 from public.producer_members where user_id = v_user) then
    raise exception 'This account already belongs to a producer.';
  end if;
  insert into public.producers (name, country, website)
  values (btrim(p_name), upper(btrim(p_country)), nullif(btrim(p_website), ''))
  returning id into v_id;
  insert into public.producer_members (producer_id, user_id, role) values (v_id, v_user, 'owner');
  return v_id;
end;
$$;

-- ---------------------------------------------------------------- products

create function public.add_product(
  p_producer_id uuid,
  p_name text,
  p_product_type text,
  p_cultivar text default null,
  p_description text default null
)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_id uuid;
begin
  perform public.kyp_require_member(p_producer_id);
  insert into public.products (producer_id, name, product_type, cultivar, description)
  values (p_producer_id, btrim(p_name), p_product_type,
          nullif(btrim(p_cultivar), ''), nullif(btrim(p_description), ''))
  returning id into v_id;
  return v_id;
end;
$$;

-- ---------------------------------------------------------------- batches

create function public.create_batch(
  p_product_id uuid,
  p_batch_number text,
  p_harvest_date date default null,
  p_packaging_date date default null,
  p_origin_grower text default null,
  p_origin_place text default null,
  p_origin_country text default null
)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_producer uuid;
  v_id uuid;
begin
  select producer_id into v_producer from public.products where id = p_product_id;
  perform public.kyp_require_member(v_producer);
  if exists (select 1 from public.batches
             where producer_id = v_producer and batch_number = btrim(p_batch_number)) then
    raise exception 'Batch number % already exists.', btrim(p_batch_number);
  end if;
  insert into public.batches (
    producer_id, product_id, batch_number, harvest_date, packaging_date,
    origin_grower, origin_place, origin_country, passport_code, created_by
  ) values (
    v_producer, p_product_id, btrim(p_batch_number), p_harvest_date, p_packaging_date,
    nullif(btrim(p_origin_grower), ''), nullif(btrim(p_origin_place), ''),
    nullif(upper(btrim(p_origin_country)), ''), public.kyp_new_passport_code(), (select auth.uid())
  )
  returning id into v_id;
  return v_id;
end;
$$;

-- Lab results can only be added to or removed from a draft: what a patient
-- saw on a published passport does not change afterwards.
-- p_items: [{"kind":"cannabinoid","name":"THC","value":22.4,"unit":"%"},
--           {"kind":"contaminant","name":"Heavy metals","passed":true}, ...]
create function public.add_lab_result(
  p_batch_id uuid,
  p_lab_name text,
  p_test_date date,
  p_coa_url text default null,
  p_items jsonb default '[]'::jsonb
)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_batch public.batches := public.kyp_batch_for_update(p_batch_id);
  v_id uuid;
begin
  if v_batch.status <> 'draft' then
    raise exception 'Lab results can only be added while the batch is a draft.';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Add at least one measured value or contaminant check.';
  end if;
  insert into public.lab_results (batch_id, lab_name, test_date, coa_url)
  values (p_batch_id, btrim(p_lab_name), p_test_date, nullif(btrim(p_coa_url), ''))
  returning id into v_id;
  insert into public.lab_result_items (lab_result_id, kind, name, value, unit, passed, sort_order)
  select v_id, e.item ->> 'kind', btrim(e.item ->> 'name'),
         (e.item ->> 'value')::numeric, nullif(btrim(e.item ->> 'unit'), ''),
         (e.item ->> 'passed')::boolean, e.ord::integer
  from jsonb_array_elements(p_items) with ordinality as e(item, ord);
  return v_id;
end;
$$;

create function public.remove_lab_result(p_lab_result_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_batch public.batches := public.kyp_batch_for_update(
    (select batch_id from public.lab_results where id = p_lab_result_id));
begin
  if v_batch.status <> 'draft' then
    raise exception 'Lab results can only be removed while the batch is a draft.';
  end if;
  delete from public.lab_results where id = p_lab_result_id;
end;
$$;

-- Journey steps can be added to a draft or a published batch (the journey
-- continues after release), but not to a recalled one.
create function public.add_journey_step(
  p_batch_id uuid,
  p_stage text,
  p_place text,
  p_step_date date
)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_batch public.batches := public.kyp_batch_for_update(p_batch_id);
  v_id uuid;
begin
  if v_batch.status = 'recalled' then
    raise exception 'A recalled batch cannot be changed.';
  end if;
  insert into public.journey_steps (batch_id, stage, place, step_date)
  values (p_batch_id, p_stage, btrim(p_place), p_step_date)
  returning id into v_id;
  return v_id;
end;
$$;

create function public.remove_journey_step(p_journey_step_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_batch public.batches := public.kyp_batch_for_update(
    (select batch_id from public.journey_steps where id = p_journey_step_id));
begin
  if v_batch.status <> 'draft' then
    raise exception 'Journey steps can only be removed while the batch is a draft.';
  end if;
  delete from public.journey_steps where id = p_journey_step_id;
end;
$$;

-- draft -> published. Needs at least one lab result.
create function public.publish_batch(p_batch_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_batch public.batches := public.kyp_batch_for_update(p_batch_id);
begin
  if v_batch.status <> 'draft' then
    raise exception 'Only a draft can be published (this batch is %).', v_batch.status;
  end if;
  if not exists (select 1 from public.lab_results where batch_id = p_batch_id) then
    raise exception 'Add a lab result before publishing.';
  end if;
  update public.batches set status = 'published', published_at = now() where id = p_batch_id;
end;
$$;

-- published -> recalled. Needs a note. There is no way back.
create function public.recall_batch(p_batch_id uuid, p_note text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_batch public.batches := public.kyp_batch_for_update(p_batch_id);
begin
  if v_batch.status <> 'published' then
    raise exception 'Only a published batch can be recalled (this batch is %).', v_batch.status;
  end if;
  if p_note is null or length(btrim(p_note)) = 0 then
    raise exception 'A recall needs a note for patients.';
  end if;
  update public.batches
  set status = 'recalled', recalled_at = now(), recall_note = btrim(p_note)
  where id = p_batch_id;
end;
$$;

-- ---------------------------------------------------------------- passport

-- The public read. Returns the passport for a published or recalled batch,
-- or null for a draft or an unknown code (the two are indistinguishable).
-- Logs the view (batch and time only).
create function public.get_passport(p_code text)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_batch public.batches;
begin
  select * into v_batch from public.batches
  where passport_code = p_code and status in ('published', 'recalled');
  if not found then
    return null;
  end if;

  insert into public.scan_log (batch_id) values (v_batch.id);

  return jsonb_build_object(
    'code', v_batch.passport_code,
    'status', v_batch.status,
    'recall_note', v_batch.recall_note,
    'published_at', v_batch.published_at,
    'recalled_at', v_batch.recalled_at,
    'source', v_batch.source,
    'batch_number', v_batch.batch_number,
    'harvest_date', v_batch.harvest_date,
    'packaging_date', v_batch.packaging_date,
    'origin_grower', v_batch.origin_grower,
    'origin_place', v_batch.origin_place,
    'origin_country', v_batch.origin_country,
    'product', (
      select jsonb_build_object('name', p.name, 'product_type', p.product_type,
                                'cultivar', p.cultivar, 'description', p.description)
      from public.products p where p.id = v_batch.product_id),
    'producer', (
      select jsonb_build_object('name', o.name, 'country', o.country, 'website', o.website)
      from public.producers o where o.id = v_batch.producer_id),
    'lab_results', coalesce((
      select jsonb_agg(jsonb_build_object(
        'lab_name', r.lab_name, 'test_date', r.test_date, 'coa_url', r.coa_url,
        'items', coalesce((
          select jsonb_agg(jsonb_build_object(
            'kind', i.kind, 'name', i.name, 'value', i.value, 'unit', i.unit, 'passed', i.passed)
            order by i.sort_order, i.name)
          from public.lab_result_items i where i.lab_result_id = r.id), '[]'::jsonb))
        order by r.test_date desc, r.created_at desc)
      from public.lab_results r where r.batch_id = v_batch.id), '[]'::jsonb),
    'journey', coalesce((
      select jsonb_agg(jsonb_build_object('stage', j.stage, 'place', j.place, 'step_date', j.step_date)
        order by j.step_date, j.created_at)
      from public.journey_steps j where j.batch_id = v_batch.id), '[]'::jsonb)
  );
end;
$$;

-- ---------------------------------------------------------------- grants

revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function public.is_producer_member(uuid) to authenticated;
grant execute on function public.create_producer(text, text, text) to authenticated;
grant execute on function public.add_product(uuid, text, text, text, text) to authenticated;
grant execute on function public.create_batch(uuid, text, date, date, text, text, text) to authenticated;
grant execute on function public.add_lab_result(uuid, text, date, text, jsonb) to authenticated;
grant execute on function public.remove_lab_result(uuid) to authenticated;
grant execute on function public.add_journey_step(uuid, text, text, date) to authenticated;
grant execute on function public.remove_journey_step(uuid) to authenticated;
grant execute on function public.publish_batch(uuid) to authenticated;
grant execute on function public.recall_batch(uuid, text) to authenticated;
grant execute on function public.get_passport(text) to anon, authenticated;
