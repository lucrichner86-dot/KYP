-- KYP: Know Your Product.
-- A verification layer for regulated goods. Every fact on a public record
-- says who stands behind it, and at what level of assurance:
--
--   accredited       issued by a KYP-verified organisation holding a current
--                    accreditation that covers this kind of claim
--   independent      issued by a KYP-verified organisation other than the owner
--   system_recorded  imported from a track-and-trace system
--   self_declared    stated by the organisation that owns the lot
--   unverified       issued by an organisation KYP has not verified (or has suspended)
--
-- All writes go through the functions in 20261117000003_functions.sql.

-- ------------------------------------------------------------ organisations
-- "Know your business": an organisation exists from sign-up, but only a
-- KYP-verified organisation can publish records or count as a third party.

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 160),
  kind text not null check (kind in (
    'producer', 'importer', 'distributor', 'laboratory', 'certifier',
    'pharmacy', 'track_and_trace', 'other')),
  country text not null check (country ~ '^[A-Z]{2}$'),  -- ISO 3166-1 alpha-2
  website text check (website is null or website ~ '^https://'),
  status text not null default 'pending' check (status in ('pending', 'verified', 'suspended')),
  status_changed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.organisation_members (
  org_id uuid not null references public.organisations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index organisation_members_user_idx on public.organisation_members (user_id);

-- Registry identifiers the organisation states (LEI, GLN, VAT, licence ...).
create table public.organisation_identifiers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations (id) on delete cascade,
  scheme text not null check (scheme in ('lei', 'gln', 'vat', 'trade_register', 'licence', 'other')),
  value text not null check (length(btrim(value)) between 1 and 80),
  note text check (note is null or length(note) <= 200),
  created_at timestamptz not null default now(),
  unique (org_id, scheme, value)
);
create index organisation_identifiers_org_idx on public.organisation_identifiers (org_id);

-- KYP platform staff. Added by hand (see README), never through the app.
create table public.kyp_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- What a KYP admin checked before changing an organisation's status. Admin-only.
create table public.organisation_reviews (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations (id) on delete cascade,
  decision text not null check (decision in ('verified', 'suspended')),
  note text not null check (length(btrim(note)) between 1 and 2000),
  reviewed_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index organisation_reviews_org_idx on public.organisation_reviews (org_id);

-- Accreditations and licences, recorded by a KYP admin after checking them.
-- `covers` says which attestation kinds the accreditation makes "accredited".
create table public.accreditations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations (id) on delete cascade,
  standard text not null check (standard in (
    'ISO/IEC 17025', 'ISO/IEC 17065', 'ISO/IEC 17020', 'EU-GMP', 'GACP', 'GDP',
    'operating licence', 'other')),
  body text not null check (length(btrim(body)) between 2 and 160),
  certificate_number text,
  scope text check (scope is null or length(scope) <= 1000),
  covers text[] not null check (
    cardinality(covers) > 0
    and covers <@ array['lab_result', 'gmp_release', 'origin', 'other']::text[]),
  valid_from date,
  valid_until date,
  evidence_url text check (evidence_url is null or evidence_url ~ '^https://'),
  status text not null default 'active' check (status in ('active', 'withdrawn')),
  recorded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  check (valid_from is null or valid_until is null or valid_until >= valid_from)
);
create index accreditations_org_idx on public.accreditations (org_id);

-- ------------------------------------------------------------ products and lots

create table public.products (
  id uuid primary key default gen_random_uuid(),
  owner_org_id uuid not null references public.organisations (id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 160),
  category text not null check (category in (
    'cannabis_flower', 'cannabis_extract', 'cannabis_other', 'other')),
  gtin text check (gtin is null or gtin ~ '^[0-9]{14}$'),
  description text check (description is null or length(description) <= 600),
  created_at timestamptz not null default now(),
  unique (id, owner_org_id)
);
create index products_owner_idx on public.products (owner_org_id);

create table public.lots (
  id uuid primary key default gen_random_uuid(),
  owner_org_id uuid not null references public.organisations (id) on delete cascade,
  product_id uuid not null,
  lot_number text not null check (length(btrim(lot_number)) between 1 and 60),
  production_date date,
  expiry_date date,
  origin_country text check (origin_country is null or origin_country ~ '^[A-Z]{2}$'),
  status text not null default 'draft' check (status in ('draft', 'published', 'recalled')),
  recall_note text,
  -- Public, unguessable code for the QR link (/r/<code>).
  public_code text not null unique check (length(public_code) >= 16),
  -- 'manual' = entered in KYP; 'import' = created from a track-and-trace system.
  source text not null default 'manual' check (source in ('manual', 'import')),
  source_system text,
  external_ref text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  recalled_at timestamptz,
  foreign key (product_id, owner_org_id) references public.products (id, owner_org_id),
  unique (owner_org_id, lot_number),
  unique (source_system, external_ref),
  check (source = 'manual' or (source_system is not null and external_ref is not null)),
  check (production_date is null or expiry_date is null or expiry_date >= production_date),
  check (status = 'draft' or published_at is not null),
  check (status <> 'recalled' or (recalled_at is not null and length(btrim(recall_note)) > 0))
);
create index lots_owner_idx on public.lots (owner_org_id);
create index lots_product_idx on public.lots (product_id);

-- What happened to a lot, modelled on GS1 EPCIS events (what, where, when, who).
create table public.events (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots (id) on delete cascade,
  event_type text not null check (event_type in (
    'cultivation', 'harvest', 'processing', 'testing', 'packaging', 'release',
    'shipping', 'receiving', 'dispensing', 'destruction')),
  occurred_on date not null,
  place text not null check (length(btrim(place)) between 1 and 160),
  country text check (country is null or country ~ '^[A-Z]{2}$'),
  recorded_by_org_id uuid references public.organisations (id) on delete set null,
  source text not null default 'manual' check (source in ('manual', 'import')),
  source_system text,
  external_ref text,
  created_at timestamptz not null default now(),
  check (source = 'manual' or (source_system is not null and external_ref is not null)),
  unique (source_system, external_ref)
);
create index events_lot_idx on public.events (lot_id);

-- ------------------------------------------------------------ attestations

-- The lot owner asks a named organisation (a lab, an importer's QP, a
-- certifier) to attest something about one lot.
create table public.attestation_requests (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots (id) on delete cascade,
  requester_org_id uuid not null references public.organisations (id) on delete cascade,
  issuer_org_id uuid not null references public.organisations (id) on delete cascade,
  kind text not null check (kind in ('lab_result', 'gmp_release', 'origin', 'other')),
  note text check (note is null or length(note) <= 1000),
  status text not null default 'open' check (status in ('open', 'fulfilled', 'declined')),
  decline_reason text,
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  check (requester_org_id <> issuer_org_id)
);
create index attestation_requests_lot_idx on public.attestation_requests (lot_id);
create index attestation_requests_issuer_idx on public.attestation_requests (issuer_org_id);

-- A statement by one organisation about one lot. Never edited or deleted:
-- an issuer can only revoke it, and the revocation stays visible.
create table public.attestations (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots (id) on delete cascade,
  issuer_org_id uuid not null references public.organisations (id),
  kind text not null check (kind in ('lab_result', 'gmp_release', 'origin', 'other')),
  summary text not null check (length(btrim(summary)) between 1 and 500),
  -- Structured content. For lab_result: {"test_date": "...", "items": [...]}.
  claim jsonb not null default '{}'::jsonb,
  evidence_url text check (evidence_url is null or evidence_url ~ '^https://'),
  evidence_sha256 text check (evidence_sha256 is null or evidence_sha256 ~ '^[0-9a-f]{64}$'),
  valid_until date,
  request_id uuid references public.attestation_requests (id) on delete set null,
  status text not null default 'active' check (status in ('active', 'revoked')),
  revoked_reason text,
  revoked_at timestamptz,
  issued_by uuid references auth.users (id) on delete set null,
  issued_at timestamptz not null default now(),
  check (status = 'active' or (revoked_at is not null and length(btrim(revoked_reason)) > 0))
);
create index attestations_lot_idx on public.attestations (lot_id);
create index attestations_issuer_idx on public.attestations (issuer_org_id);

-- One row per public record view. No IP, device, location or visitor id.
create table public.scan_log (
  id bigint generated always as identity primary key,
  lot_id uuid not null references public.lots (id) on delete cascade,
  scanned_at timestamptz not null default now()
);
create index scan_log_lot_idx on public.scan_log (lot_id);
