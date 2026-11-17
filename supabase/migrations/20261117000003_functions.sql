-- Every state change, and the public read. Called from the app via RPC.
-- Each function runs as the owner (security definer) and checks the caller.

-- ------------------------------------------------------------ helpers

create function public.kyp_require_signed_in()
returns uuid
language plpgsql stable set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
begin
  if v_user is null then
    raise exception 'Sign in first.' using errcode = '42501';
  end if;
  return v_user;
end;
$$;

create function public.kyp_require_member(p_org_id uuid)
returns void
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform public.kyp_require_signed_in();
  if p_org_id is null or not public.is_org_member(p_org_id) then
    raise exception 'Not found, or not yours to change.' using errcode = '42501';
  end if;
end;
$$;

create function public.kyp_require_admin()
returns uuid
language plpgsql stable security definer set search_path = ''
as $$
declare
  v_user uuid := public.kyp_require_signed_in();
begin
  if not public.is_kyp_admin() then
    raise exception 'Only KYP staff can do this.' using errcode = '42501';
  end if;
  return v_user;
end;
$$;

-- Locks a lot, checks the caller is a member of its owner, returns it.
create function public.kyp_owned_lot_for_update(p_lot_id uuid)
returns public.lots
language plpgsql security definer set search_path = ''
as $$
declare
  v_lot public.lots;
begin
  select * into v_lot from public.lots where id = p_lot_id for update;
  perform public.kyp_require_member(v_lot.owner_org_id);
  return v_lot;
end;
$$;

-- 20 characters of Crockford base32 (100 random bits).
create function public.kyp_new_public_code()
returns text
language sql volatile set search_path = ''
as $$
  select string_agg(substr('0123456789abcdefghjkmnpqrstvwxyz', get_byte(s.h, i) % 32 + 1, 1), '')
  from (select sha256(uuid_send(gen_random_uuid()) || uuid_send(gen_random_uuid())) as h) s,
       generate_series(0, 19) i;
$$;

-- Checks the structured content of an attestation for its kind.
create function public.kyp_check_claim(p_kind text, p_claim jsonb)
returns void
language plpgsql immutable set search_path = ''
as $$
declare
  v_item jsonb;
  v_kind text;
begin
  if p_claim is null or jsonb_typeof(p_claim) <> 'object' then
    raise exception 'The claim must be an object.';
  end if;
  if p_kind <> 'lab_result' then
    return;
  end if;
  if (p_claim ->> 'test_date') is null or (p_claim ->> 'test_date') !~ '^\d{4}-\d{2}-\d{2}$' then
    raise exception 'A lab result needs a test date.';
  end if;
  if jsonb_typeof(p_claim -> 'items') is distinct from 'array' or jsonb_array_length(p_claim -> 'items') = 0 then
    raise exception 'A lab result needs at least one measured value or contaminant check.';
  end if;
  for v_item in select * from jsonb_array_elements(p_claim -> 'items') loop
    v_kind := v_item ->> 'kind';
    if v_kind not in ('cannabinoid', 'terpene', 'contaminant', 'other')
       or length(btrim(coalesce(v_item ->> 'name', ''))) = 0 then
      raise exception 'Each lab result row needs a kind and a name.';
    end if;
    if v_kind = 'contaminant' then
      if jsonb_typeof(v_item -> 'passed') is distinct from 'boolean' then
        raise exception 'Contaminant check "%" needs pass or fail.', v_item ->> 'name';
      end if;
    else
      if jsonb_typeof(v_item -> 'value') is distinct from 'number' or (v_item ->> 'value')::numeric < 0
         or length(btrim(coalesce(v_item ->> 'unit', ''))) = 0 then
        raise exception 'Value "%" needs a number and a unit.', v_item ->> 'name';
      end if;
    end if;
  end loop;
end;
$$;

-- The assurance level of one attestation, evaluated now.
create function public.attestation_level(
  p_issuer_org_id uuid, p_owner_org_id uuid, p_kind text, p_issued_at timestamptz)
returns text
language sql stable security definer set search_path = ''
as $$
  select case
    when p_issuer_org_id = p_owner_org_id then 'self_declared'
    when (select status from public.organisations where id = p_issuer_org_id) <> 'verified' then 'unverified'
    when exists (
      select 1 from public.accreditations a
      where a.org_id = p_issuer_org_id and a.status = 'active' and p_kind = any (a.covers)
        and (a.valid_from is null or a.valid_from <= p_issued_at::date)
        and (a.valid_until is null or a.valid_until >= p_issued_at::date)) then 'accredited'
    else 'independent'
  end;
$$;

-- ------------------------------------------------------------ organisations

create function public.create_organisation(
  p_name text, p_kind text, p_country text, p_website text default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_user uuid := public.kyp_require_signed_in();
  v_id uuid;
begin
  -- One organisation per account for now.
  if exists (select 1 from public.organisation_members where user_id = v_user) then
    raise exception 'This account already belongs to an organisation.';
  end if;
  insert into public.organisations (name, kind, country, website)
  values (btrim(p_name), p_kind, upper(btrim(p_country)), nullif(btrim(p_website), ''))
  returning id into v_id;
  insert into public.organisation_members (org_id, user_id, role) values (v_id, v_user, 'owner');
  return v_id;
end;
$$;

create function public.add_organisation_identifier(
  p_org_id uuid, p_scheme text, p_value text, p_note text default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_id uuid;
begin
  perform public.kyp_require_member(p_org_id);
  -- Identifiers are what KYP checks; they are frozen once the org is verified.
  if (select status from public.organisations where id = p_org_id) = 'verified' then
    raise exception 'Identifiers cannot be changed after verification. Contact KYP.';
  end if;
  insert into public.organisation_identifiers (org_id, scheme, value, note)
  values (p_org_id, p_scheme, btrim(p_value), nullif(btrim(p_note), ''))
  returning id into v_id;
  return v_id;
end;
$$;

-- ------------------------------------------------------------ KYP staff

create function public.review_organisation(p_org_id uuid, p_decision text, p_note text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_admin uuid := public.kyp_require_admin();
begin
  if p_decision not in ('verified', 'suspended') then
    raise exception 'Decision must be verified or suspended.';
  end if;
  if p_note is null or length(btrim(p_note)) = 0 then
    raise exception 'Record what was checked.';
  end if;
  update public.organisations set status = p_decision, status_changed_at = now() where id = p_org_id;
  if not found then
    raise exception 'Organisation not found.';
  end if;
  insert into public.organisation_reviews (org_id, decision, note, reviewed_by)
  values (p_org_id, p_decision, btrim(p_note), v_admin);
end;
$$;

create function public.record_accreditation(
  p_org_id uuid, p_standard text, p_body text, p_covers text[],
  p_certificate_number text default null, p_scope text default null,
  p_valid_from date default null, p_valid_until date default null, p_evidence_url text default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_admin uuid := public.kyp_require_admin();
  v_id uuid;
begin
  if not exists (select 1 from public.organisations where id = p_org_id) then
    raise exception 'Organisation not found.';
  end if;
  insert into public.accreditations (
    org_id, standard, body, covers, certificate_number, scope,
    valid_from, valid_until, evidence_url, recorded_by)
  values (
    p_org_id, p_standard, btrim(p_body), p_covers, nullif(btrim(p_certificate_number), ''),
    nullif(btrim(p_scope), ''), p_valid_from, p_valid_until, nullif(btrim(p_evidence_url), ''), v_admin)
  returning id into v_id;
  return v_id;
end;
$$;

create function public.withdraw_accreditation(p_accreditation_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform public.kyp_require_admin();
  update public.accreditations set status = 'withdrawn' where id = p_accreditation_id;
end;
$$;

-- ------------------------------------------------------------ products and lots

create function public.add_product(
  p_org_id uuid, p_name text, p_category text,
  p_gtin text default null, p_description text default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_id uuid;
begin
  perform public.kyp_require_member(p_org_id);
  insert into public.products (owner_org_id, name, category, gtin, description)
  values (p_org_id, btrim(p_name), p_category, nullif(btrim(p_gtin), ''), nullif(btrim(p_description), ''))
  returning id into v_id;
  return v_id;
end;
$$;

create function public.create_lot(
  p_product_id uuid, p_lot_number text,
  p_production_date date default null, p_expiry_date date default null,
  p_origin_country text default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_org uuid;
  v_id uuid;
begin
  select owner_org_id into v_org from public.products where id = p_product_id;
  perform public.kyp_require_member(v_org);
  if exists (select 1 from public.lots where owner_org_id = v_org and lot_number = btrim(p_lot_number)) then
    raise exception 'Lot number % already exists.', btrim(p_lot_number);
  end if;
  insert into public.lots (
    owner_org_id, product_id, lot_number, production_date, expiry_date, origin_country,
    public_code, created_by)
  values (
    v_org, p_product_id, btrim(p_lot_number), p_production_date, p_expiry_date,
    nullif(upper(btrim(p_origin_country)), ''), public.kyp_new_public_code(), (select auth.uid()))
  returning id into v_id;
  return v_id;
end;
$$;

create function public.record_event(
  p_lot_id uuid, p_event_type text, p_occurred_on date, p_place text, p_country text default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_lot public.lots := public.kyp_owned_lot_for_update(p_lot_id);
  v_id uuid;
begin
  if v_lot.status = 'recalled' then
    raise exception 'A recalled lot cannot be changed.';
  end if;
  insert into public.events (lot_id, event_type, occurred_on, place, country, recorded_by_org_id)
  values (p_lot_id, p_event_type, p_occurred_on, btrim(p_place),
          nullif(upper(btrim(p_country)), ''), v_lot.owner_org_id)
  returning id into v_id;
  return v_id;
end;
$$;

-- Manual events can be removed while the lot is a draft. Imported ones cannot.
create function public.remove_event(p_event_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_event public.events;
  v_lot public.lots;
begin
  select * into v_event from public.events where id = p_event_id;
  v_lot := public.kyp_owned_lot_for_update(v_event.lot_id);
  if v_lot.status <> 'draft' then
    raise exception 'Events can only be removed while the lot is a draft.';
  end if;
  if v_event.source <> 'manual' then
    raise exception 'Imported events cannot be removed.';
  end if;
  delete from public.events where id = p_event_id;
end;
$$;

-- For a track-and-trace integration running server-side with the service
-- key. Not callable from the browser.
create function public.import_event(
  p_lot_id uuid, p_source_system text, p_external_ref text,
  p_event_type text, p_occurred_on date, p_place text, p_country text default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_lot public.lots;
  v_id uuid;
begin
  select * into v_lot from public.lots where id = p_lot_id for update;
  if not found then
    raise exception 'Lot not found.';
  end if;
  if v_lot.status = 'recalled' then
    raise exception 'A recalled lot cannot be changed.';
  end if;
  insert into public.events (
    lot_id, event_type, occurred_on, place, country, source, source_system, external_ref)
  values (
    p_lot_id, p_event_type, p_occurred_on, btrim(p_place), nullif(upper(btrim(p_country)), ''),
    'import', btrim(p_source_system), btrim(p_external_ref))
  on conflict (source_system, external_ref) do nothing
  returning id into v_id;
  return v_id;
end;
$$;

-- ------------------------------------------------------------ attestations

create function public.request_attestation(
  p_lot_id uuid, p_issuer_org_id uuid, p_kind text, p_note text default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_lot public.lots := public.kyp_owned_lot_for_update(p_lot_id);
  v_id uuid;
begin
  if v_lot.status = 'recalled' then
    raise exception 'A recalled lot cannot be changed.';
  end if;
  if p_issuer_org_id = v_lot.owner_org_id then
    raise exception 'Ask another organisation. Your own statements are added directly.';
  end if;
  if (select status from public.organisations where id = p_issuer_org_id) is distinct from 'verified' then
    raise exception 'Requests can only go to organisations KYP has verified.';
  end if;
  if exists (select 1 from public.attestation_requests
             where lot_id = p_lot_id and issuer_org_id = p_issuer_org_id
               and kind = p_kind and status = 'open') then
    raise exception 'An open request of this kind already exists for this organisation.';
  end if;
  insert into public.attestation_requests (lot_id, requester_org_id, issuer_org_id, kind, note)
  values (p_lot_id, v_lot.owner_org_id, p_issuer_org_id, p_kind, nullif(btrim(p_note), ''))
  returning id into v_id;
  return v_id;
end;
$$;

create function public.decline_attestation_request(p_request_id uuid, p_reason text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_request public.attestation_requests;
begin
  select * into v_request from public.attestation_requests where id = p_request_id for update;
  perform public.kyp_require_member(v_request.issuer_org_id);
  if v_request.status <> 'open' then
    raise exception 'This request is already closed.';
  end if;
  update public.attestation_requests
  set status = 'declined', decline_reason = nullif(btrim(p_reason), ''), closed_at = now()
  where id = p_request_id;
end;
$$;

-- Issues a statement about a lot on behalf of p_issuer_org_id.
-- The owner can always state things about its own lot (self-declared).
-- Anyone else needs an open request from the owner; issuing fulfils it.
-- Once issued, the owner cannot remove it.
create function public.issue_attestation(
  p_issuer_org_id uuid, p_lot_id uuid, p_kind text, p_summary text,
  p_claim jsonb default '{}'::jsonb, p_evidence_url text default null,
  p_evidence_sha256 text default null, p_valid_until date default null,
  p_request_id uuid default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_lot public.lots;
  v_request public.attestation_requests;
  v_id uuid;
begin
  perform public.kyp_require_member(p_issuer_org_id);
  if (select status from public.organisations where id = p_issuer_org_id) = 'suspended' then
    raise exception 'A suspended organisation cannot issue statements.';
  end if;
  select * into v_lot from public.lots where id = p_lot_id for update;
  if not found then
    raise exception 'Not found, or not yours to change.' using errcode = '42501';
  end if;
  if v_lot.status = 'recalled' then
    raise exception 'A recalled lot cannot be changed.';
  end if;

  if p_issuer_org_id <> v_lot.owner_org_id then
    select * into v_request from public.attestation_requests
    where id = p_request_id and lot_id = p_lot_id and issuer_org_id = p_issuer_org_id
    for update;
    if not found then
      raise exception 'Not found, or not yours to change.' using errcode = '42501';
    end if;
    if v_request.status <> 'open' then
      raise exception 'This request is already closed.';
    end if;
    if v_request.kind <> p_kind then
      raise exception 'This request asks for a % statement.', v_request.kind;
    end if;
  elsif p_request_id is not null then
    raise exception 'Your own statements do not answer a request.';
  end if;

  perform public.kyp_check_claim(p_kind, p_claim);

  insert into public.attestations (
    lot_id, issuer_org_id, kind, summary, claim, evidence_url, evidence_sha256,
    valid_until, request_id, issued_by)
  values (
    p_lot_id, p_issuer_org_id, p_kind, btrim(p_summary), coalesce(p_claim, '{}'::jsonb),
    nullif(btrim(p_evidence_url), ''), nullif(lower(btrim(p_evidence_sha256)), ''),
    p_valid_until, p_request_id, (select auth.uid()))
  returning id into v_id;

  if p_request_id is not null then
    update public.attestation_requests set status = 'fulfilled', closed_at = now()
    where id = p_request_id;
  end if;
  return v_id;
end;
$$;

-- Only the issuer can revoke. The statement stays on the record as revoked.
create function public.revoke_attestation(p_attestation_id uuid, p_reason text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_att public.attestations;
begin
  select * into v_att from public.attestations where id = p_attestation_id for update;
  perform public.kyp_require_member(v_att.issuer_org_id);
  if v_att.status = 'revoked' then
    raise exception 'Already revoked.';
  end if;
  if p_reason is null or length(btrim(p_reason)) = 0 then
    raise exception 'Say why the statement is revoked.';
  end if;
  update public.attestations
  set status = 'revoked', revoked_reason = btrim(p_reason), revoked_at = now()
  where id = p_attestation_id;
end;
$$;

-- ------------------------------------------------------------ lifecycle

-- draft -> published. The owner must be verified by KYP, and the lot needs
-- at least one active statement.
create function public.publish_lot(p_lot_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_lot public.lots := public.kyp_owned_lot_for_update(p_lot_id);
begin
  if v_lot.status <> 'draft' then
    raise exception 'Only a draft can be published (this lot is %).', v_lot.status;
  end if;
  if (select status from public.organisations where id = v_lot.owner_org_id) <> 'verified' then
    raise exception 'Your organisation must be verified by KYP before it can publish.';
  end if;
  if not exists (select 1 from public.attestations where lot_id = p_lot_id and status = 'active') then
    raise exception 'Add at least one statement before publishing.';
  end if;
  update public.lots set status = 'published', published_at = now() where id = p_lot_id;
end;
$$;

-- published -> recalled. Needs a note. Final.
create function public.recall_lot(p_lot_id uuid, p_note text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_lot public.lots := public.kyp_owned_lot_for_update(p_lot_id);
begin
  if v_lot.status <> 'published' then
    raise exception 'Only a published lot can be recalled (this lot is %).', v_lot.status;
  end if;
  if p_note is null or length(btrim(p_note)) = 0 then
    raise exception 'A recall needs a note for the public.';
  end if;
  update public.lots
  set status = 'recalled', recalled_at = now(), recall_note = btrim(p_note)
  where id = p_lot_id;
end;
$$;

-- ------------------------------------------------------------ public read

-- The public record of one published or recalled lot, or null (a draft and
-- an unknown code look the same). Logs the view: lot and time only.
create function public.get_record(p_code text)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_lot public.lots;
begin
  select * into v_lot from public.lots
  where public_code = p_code and status in ('published', 'recalled');
  if not found then
    return null;
  end if;
  insert into public.scan_log (lot_id) values (v_lot.id);

  return jsonb_build_object(
    'code', v_lot.public_code,
    'status', v_lot.status,
    'recall_note', v_lot.recall_note,
    'published_at', v_lot.published_at,
    'recalled_at', v_lot.recalled_at,
    'lot_number', v_lot.lot_number,
    'production_date', v_lot.production_date,
    'expiry_date', v_lot.expiry_date,
    'origin_country', v_lot.origin_country,
    'product', (
      select jsonb_build_object('name', p.name, 'category', p.category, 'gtin', p.gtin,
                                'description', p.description)
      from public.products p where p.id = v_lot.product_id),
    'owner', (
      select jsonb_build_object('name', o.name, 'kind', o.kind, 'country', o.country, 'status', o.status)
      from public.organisations o where o.id = v_lot.owner_org_id),
    'attestations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'kind', a.kind,
        'summary', a.summary,
        'claim', a.claim,
        'evidence_url', a.evidence_url,
        'evidence_sha256', a.evidence_sha256,
        'valid_until', a.valid_until,
        'issued_at', a.issued_at,
        'status', a.status,
        'revoked_reason', a.revoked_reason,
        'revoked_at', a.revoked_at,
        'level', public.attestation_level(a.issuer_org_id, v_lot.owner_org_id, a.kind, a.issued_at),
        'issuer', jsonb_build_object(
          'name', o.name, 'kind', o.kind, 'country', o.country, 'status', o.status,
          'accreditations', coalesce((
            select jsonb_agg(jsonb_build_object(
              'standard', ac.standard, 'body', ac.body, 'certificate_number', ac.certificate_number,
              'valid_until', ac.valid_until) order by ac.standard)
            from public.accreditations ac
            where ac.org_id = o.id and ac.status = 'active' and a.kind = any (ac.covers)
              and (ac.valid_until is null or ac.valid_until >= a.issued_at::date)), '[]'::jsonb)))
        order by a.issued_at)
      from public.attestations a
      join public.organisations o on o.id = a.issuer_org_id
      where a.lot_id = v_lot.id), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', e.event_type,
        'occurred_on', e.occurred_on,
        'place', e.place,
        'country', e.country,
        'level', case when e.source = 'import' then 'system_recorded' else 'self_declared' end,
        'source_system', e.source_system)
        order by e.occurred_on, e.created_at)
      from public.events e where e.lot_id = v_lot.id), '[]'::jsonb)
  );
end;
$$;

-- ------------------------------------------------------------ grants

revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function public.is_kyp_admin() to authenticated;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.can_see_lot(uuid) to authenticated;
grant execute on function public.attestation_level(uuid, uuid, text, timestamptz) to authenticated;
grant execute on function public.create_organisation(text, text, text, text) to authenticated;
grant execute on function public.add_organisation_identifier(uuid, text, text, text) to authenticated;
grant execute on function public.review_organisation(uuid, text, text) to authenticated;
grant execute on function public.record_accreditation(uuid, text, text, text[], text, text, date, date, text) to authenticated;
grant execute on function public.withdraw_accreditation(uuid) to authenticated;
grant execute on function public.add_product(uuid, text, text, text, text) to authenticated;
grant execute on function public.create_lot(uuid, text, date, date, text) to authenticated;
grant execute on function public.record_event(uuid, text, date, text, text) to authenticated;
grant execute on function public.remove_event(uuid) to authenticated;
grant execute on function public.request_attestation(uuid, uuid, text, text) to authenticated;
grant execute on function public.decline_attestation_request(uuid, text) to authenticated;
grant execute on function public.issue_attestation(uuid, uuid, text, text, jsonb, text, text, date, uuid) to authenticated;
grant execute on function public.revoke_attestation(uuid, text) to authenticated;
grant execute on function public.publish_lot(uuid) to authenticated;
grant execute on function public.recall_lot(uuid, text) to authenticated;
grant execute on function public.get_record(text) to anon, authenticated;
grant execute on function public.import_event(uuid, text, text, text, date, text, text) to service_role;
