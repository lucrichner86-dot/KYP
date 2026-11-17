-- Row level security.
--
-- Public (anon): no table access. A record is read through get_record(code).
-- Signed-in users: can read the organisation directory (name, kind, country,
--   status), identifiers and accreditations, which are meant to be public
--   facts about businesses. Everything else only where they are involved:
--   their own organisation's data, and lots they were asked to attest.
-- KYP admins: can read everything.
-- Nobody writes to tables directly; every change is a function.

create function public.is_kyp_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.kyp_admins where user_id = (select auth.uid()));
$$;

create function public.is_org_member(p_org_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.organisation_members
    where org_id = p_org_id and user_id = (select auth.uid()));
$$;

-- Owner members, members of an organisation asked to attest it or that has
-- attested it, and KYP admins.
create function public.can_see_lot(p_lot_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.is_kyp_admin()
    or exists (select 1 from public.lots l
               where l.id = p_lot_id and public.is_org_member(l.owner_org_id))
    or exists (select 1 from public.attestation_requests r
               where r.lot_id = p_lot_id and public.is_org_member(r.issuer_org_id))
    or exists (select 1 from public.attestations a
               where a.lot_id = p_lot_id and public.is_org_member(a.issuer_org_id));
$$;

alter table public.organisations enable row level security;
alter table public.organisation_members enable row level security;
alter table public.organisation_identifiers enable row level security;
alter table public.kyp_admins enable row level security;
alter table public.organisation_reviews enable row level security;
alter table public.accreditations enable row level security;
alter table public.products enable row level security;
alter table public.lots enable row level security;
alter table public.events enable row level security;
alter table public.attestation_requests enable row level security;
alter table public.attestations enable row level security;
alter table public.scan_log enable row level security;

create policy "directory" on public.organisations
  for select to authenticated using (true);

create policy "own memberships" on public.organisation_members
  for select to authenticated using (public.is_org_member(org_id) or public.is_kyp_admin());

create policy "identifiers are public to signed-in users" on public.organisation_identifiers
  for select to authenticated using (true);

create policy "own admin row" on public.kyp_admins
  for select to authenticated using (user_id = (select auth.uid()));

create policy "admins read reviews" on public.organisation_reviews
  for select to authenticated using (public.is_kyp_admin());

create policy "accreditations are public to signed-in users" on public.accreditations
  for select to authenticated using (true);

create policy "products of visible lots" on public.products
  for select to authenticated using (
    public.is_org_member(owner_org_id) or public.is_kyp_admin()
    or exists (select 1 from public.lots l where l.product_id = products.id and public.can_see_lot(l.id)));

create policy "visible lots" on public.lots
  for select to authenticated using (public.can_see_lot(id));

create policy "events of visible lots" on public.events
  for select to authenticated using (public.can_see_lot(lot_id));

create policy "requests involving us" on public.attestation_requests
  for select to authenticated using (
    public.is_org_member(requester_org_id) or public.is_org_member(issuer_org_id)
    or public.is_kyp_admin());

create policy "attestations of visible lots" on public.attestations
  for select to authenticated using (public.can_see_lot(lot_id));

create policy "owners read scans" on public.scan_log
  for select to authenticated using (exists (
    select 1 from public.lots l where l.id = lot_id and public.is_org_member(l.owner_org_id)));

revoke all on all tables in schema public from anon, authenticated;
grant select on
  public.organisations, public.organisation_members, public.organisation_identifiers,
  public.kyp_admins, public.organisation_reviews, public.accreditations, public.products,
  public.lots, public.events, public.attestation_requests, public.attestations, public.scan_log
  to authenticated;
