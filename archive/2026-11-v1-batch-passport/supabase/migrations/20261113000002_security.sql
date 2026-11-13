-- Row level security.
--
-- Public (anon): no direct table access at all. The passport is read through
--   get_passport(code), which returns one published or recalled batch for a
--   code the caller already knows. A table policy on status alone would let
--   anyone list every passport code.
-- Members (authenticated): may read their own producer's rows. No insert,
--   update or delete on any table; state changes go through functions.

create function public.is_producer_member(p_producer_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.producer_members m
    where m.producer_id = p_producer_id and m.user_id = (select auth.uid())
  );
$$;

alter table public.producers enable row level security;
alter table public.producer_members enable row level security;
alter table public.products enable row level security;
alter table public.batches enable row level security;
alter table public.lab_results enable row level security;
alter table public.lab_result_items enable row level security;
alter table public.journey_steps enable row level security;
alter table public.scan_log enable row level security;

create policy "members read own producer" on public.producers
  for select to authenticated using (public.is_producer_member(id));

create policy "members read own membership" on public.producer_members
  for select to authenticated using (public.is_producer_member(producer_id));

create policy "members read own products" on public.products
  for select to authenticated using (public.is_producer_member(producer_id));

create policy "members read own batches" on public.batches
  for select to authenticated using (public.is_producer_member(producer_id));

create policy "members read own lab results" on public.lab_results
  for select to authenticated using (exists (
    select 1 from public.batches b
    where b.id = batch_id and public.is_producer_member(b.producer_id)
  ));

create policy "members read own lab result items" on public.lab_result_items
  for select to authenticated using (exists (
    select 1 from public.lab_results r
    join public.batches b on b.id = r.batch_id
    where r.id = lab_result_id and public.is_producer_member(b.producer_id)
  ));

create policy "members read own journey steps" on public.journey_steps
  for select to authenticated using (exists (
    select 1 from public.batches b
    where b.id = batch_id and public.is_producer_member(b.producer_id)
  ));

create policy "members read own scan log" on public.scan_log
  for select to authenticated using (exists (
    select 1 from public.batches b
    where b.id = batch_id and public.is_producer_member(b.producer_id)
  ));

-- Table privileges: read-only for signed-in users, nothing for the public.
revoke all on all tables in schema public from anon, authenticated;
grant select on
  public.producers, public.producer_members, public.products, public.batches,
  public.lab_results, public.lab_result_items, public.journey_steps, public.scan_log
  to authenticated;

revoke execute on function public.is_producer_member(uuid) from public, anon;
grant execute on function public.is_producer_member(uuid) to authenticated;
