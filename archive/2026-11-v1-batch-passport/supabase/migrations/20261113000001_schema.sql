-- KYP schema: producers, products, batches, lab results, journey, scan log.
-- All writes go through the functions in 20261113000003_functions.sql.

create table public.producers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 120),
  country text not null check (country ~ '^[A-Z]{2}$'),  -- ISO 3166-1 alpha-2
  website text check (website is null or website ~ '^https://'),
  created_at timestamptz not null default now()
);

create table public.producer_members (
  producer_id uuid not null references public.producers (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (producer_id, user_id)
);
create index producer_members_user_idx on public.producer_members (user_id);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid not null references public.producers (id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 120),
  product_type text not null check (product_type in ('flower', 'extract', 'other')),
  cultivar text,
  description text check (description is null or length(description) <= 600),
  created_at timestamptz not null default now(),
  unique (id, producer_id)
);
create index products_producer_idx on public.products (producer_id);

create table public.batches (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid not null references public.producers (id) on delete cascade,
  product_id uuid not null,
  batch_number text not null check (length(btrim(batch_number)) between 1 and 60),
  harvest_date date,
  packaging_date date,
  origin_grower text,
  origin_place text,
  origin_country text check (origin_country is null or origin_country ~ '^[A-Z]{2}$'),
  status text not null default 'draft' check (status in ('draft', 'published', 'recalled')),
  recall_note text,
  -- Public, unguessable code used in the QR link (/p/<code>).
  passport_code text not null unique check (length(passport_code) >= 16),
  -- Where the record came from. 'manual' = typed in by the producer in the
  -- back office; 'cannavigia' = imported from track and trace (later).
  source text not null default 'manual' check (source in ('manual', 'cannavigia')),
  external_ref text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  recalled_at timestamptz,
  -- A batch can only point at a product of the same producer.
  foreign key (product_id, producer_id) references public.products (id, producer_id),
  unique (producer_id, batch_number),
  unique (source, external_ref),
  check (harvest_date is null or packaging_date is null or packaging_date >= harvest_date),
  check (status = 'draft' or published_at is not null),
  check (status <> 'recalled' or (recalled_at is not null and length(btrim(recall_note)) > 0))
);
create index batches_producer_idx on public.batches (producer_id);
create index batches_product_idx on public.batches (product_id);

create table public.lab_results (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches (id) on delete cascade,
  lab_name text not null check (length(btrim(lab_name)) between 1 and 160),
  test_date date not null,
  coa_url text check (coa_url is null or coa_url ~ '^https://'),
  created_at timestamptz not null default now()
);
create index lab_results_batch_idx on public.lab_results (batch_id);

-- One row per measured value or contaminant check.
create table public.lab_result_items (
  id uuid primary key default gen_random_uuid(),
  lab_result_id uuid not null references public.lab_results (id) on delete cascade,
  kind text not null check (kind in ('cannabinoid', 'terpene', 'contaminant')),
  name text not null check (length(btrim(name)) between 1 and 80),
  value numeric check (value is null or value >= 0),
  unit text,
  passed boolean,
  sort_order integer not null default 0,
  check (
    (kind = 'contaminant' and passed is not null and value is null)
    or (kind <> 'contaminant' and value is not null and unit is not null and passed is null)
  )
);
create index lab_result_items_result_idx on public.lab_result_items (lab_result_id);

create table public.journey_steps (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches (id) on delete cascade,
  stage text not null check (stage in (
    'cultivation', 'harvest', 'processing', 'testing', 'packaging', 'distribution', 'dispensing'
  )),
  place text not null check (length(btrim(place)) between 1 and 160),
  step_date date not null,
  created_at timestamptz not null default now()
);
create index journey_steps_batch_idx on public.journey_steps (batch_id);

-- One row per passport view. Deliberately no IP address, user agent, location
-- or visitor identifier: nothing here relates to a person.
create table public.scan_log (
  id bigint generated always as identity primary key,
  batch_id uuid not null references public.batches (id) on delete cascade,
  scanned_at timestamptz not null default now()
);
create index scan_log_batch_idx on public.scan_log (batch_id);
