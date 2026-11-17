-- Demo data. Every organisation, lot and document here is invented and
-- marked "(demo)". Safe to run once on an empty database after the
-- migrations; remove with the statement at the bottom.
--
--   Alpenblick Pharma AG (demo)    producer, verified
--   Helvetia Analytik GmbH (demo)  laboratory, verified, ISO/IEC 17025 (demo body)
--   Nordlicht Import GmbH (demo)   importer, verified, no accreditation on file
--
--   demo-kyp-flower-014   published: accredited lab result, independent GMP release,
--                         self-declared origin, track-and-trace events
--   demo-kyp-flower-009   recalled
--   demo-kyp-extract-003  draft (not public)

insert into public.organisations (id, name, kind, country, website, status, status_changed_at) values
  ('d1000000-0000-4000-8000-000000000001', 'Alpenblick Pharma AG (demo)', 'producer', 'CH', null, 'verified', '2026-03-02 10:00+00'),
  ('d1000000-0000-4000-8000-000000000002', 'Helvetia Analytik GmbH (demo)', 'laboratory', 'CH', null, 'verified', '2026-03-02 10:05+00'),
  ('d1000000-0000-4000-8000-000000000003', 'Nordlicht Import GmbH (demo)', 'importer', 'DE', null, 'verified', '2026-03-03 09:00+00');

insert into public.organisation_identifiers (org_id, scheme, value, note) values
  ('d1000000-0000-4000-8000-000000000001', 'trade_register', 'CHE-000.000.001 (demo)', null),
  ('d1000000-0000-4000-8000-000000000002', 'trade_register', 'CHE-000.000.002 (demo)', null),
  ('d1000000-0000-4000-8000-000000000003', 'trade_register', 'HRB 00000 (demo)', null);

insert into public.organisation_reviews (org_id, decision, note) values
  ('d1000000-0000-4000-8000-000000000001', 'verified', 'Demo data: no real check was made.'),
  ('d1000000-0000-4000-8000-000000000002', 'verified', 'Demo data: no real check was made.'),
  ('d1000000-0000-4000-8000-000000000003', 'verified', 'Demo data: no real check was made.');

insert into public.accreditations (org_id, standard, body, certificate_number, scope, covers, valid_from, valid_until) values
  ('d1000000-0000-4000-8000-000000000002', 'ISO/IEC 17025', 'Demo accreditation body', 'DEMO-0001',
   'Cannabinoids, terpenes, microbiology, heavy metals, pesticides, mycotoxins in cannabis flower (demo)',
   array['lab_result'], '2025-01-01', '2029-12-31');

insert into public.products (id, owner_org_id, name, category, gtin, description) values
  ('d2000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000001',
   'Alpenblick 22/1 (demo)', 'cannabis_flower', null, 'Dried cannabis flower, 10 g, sealed container.'),
  ('d2000000-0000-4000-8000-000000000002', 'd1000000-0000-4000-8000-000000000001',
   'Alpenblick Extract 10/10 (demo)', 'cannabis_extract', null, 'Cannabis extract in MCT oil, 30 ml.');

insert into public.lots (
  id, owner_org_id, product_id, lot_number, production_date, expiry_date, origin_country,
  status, recall_note, public_code, published_at, recalled_at) values
  ('d3000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000001',
   'd2000000-0000-4000-8000-000000000001', 'AB-2026-014', '2026-07-22', '2027-07-22', 'CH',
   'published', null, 'demo-kyp-flower-014', '2026-08-05 09:00+00', null),
  ('d3000000-0000-4000-8000-000000000002', 'd1000000-0000-4000-8000-000000000001',
   'd2000000-0000-4000-8000-000000000001', 'AB-2026-009', '2026-04-15', '2027-04-15', 'CH',
   'recalled',
   'Recalled by the producer on 2 June 2026: a follow-up test by the laboratory found the microbial count above the limit. Do not use packs from this lot. Return them to the pharmacy that dispensed them.',
   'demo-kyp-flower-009', '2026-04-29 09:00+00', '2026-06-02 14:30+00'),
  ('d3000000-0000-4000-8000-000000000003', 'd1000000-0000-4000-8000-000000000001',
   'd2000000-0000-4000-8000-000000000002', 'AX-2026-003', '2026-10-01', '2028-10-01', 'CH',
   'draft', null, 'demo-kyp-extract-003', null, null);

insert into public.attestation_requests (id, lot_id, requester_org_id, issuer_org_id, kind, status, created_at, closed_at) values
  ('d4000000-0000-4000-8000-000000000001', 'd3000000-0000-4000-8000-000000000001',
   'd1000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000002', 'lab_result', 'fulfilled', '2026-07-08', '2026-07-14'),
  ('d4000000-0000-4000-8000-000000000002', 'd3000000-0000-4000-8000-000000000001',
   'd1000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000003', 'gmp_release', 'fulfilled', '2026-07-25', '2026-08-01'),
  ('d4000000-0000-4000-8000-000000000003', 'd3000000-0000-4000-8000-000000000002',
   'd1000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000002', 'lab_result', 'fulfilled', '2026-04-01', '2026-04-07');

insert into public.attestations (
  lot_id, issuer_org_id, kind, summary, claim, evidence_url, evidence_sha256, request_id, status,
  revoked_reason, revoked_at, issued_at) values
  ('d3000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000002', 'lab_result',
   'Full release panel. All contaminant checks passed.',
   '{"test_date":"2026-07-14","items":[
      {"kind":"cannabinoid","name":"THC","value":22.4,"unit":"%"},
      {"kind":"cannabinoid","name":"CBD","value":0.6,"unit":"%"},
      {"kind":"cannabinoid","name":"CBG","value":0.9,"unit":"%"},
      {"kind":"terpene","name":"Myrcene","value":0.82,"unit":"%"},
      {"kind":"terpene","name":"Limonene","value":0.41,"unit":"%"},
      {"kind":"terpene","name":"Caryophyllene","value":0.37,"unit":"%"},
      {"kind":"contaminant","name":"Microbial count","passed":true},
      {"kind":"contaminant","name":"Heavy metals","passed":true},
      {"kind":"contaminant","name":"Pesticides","passed":true},
      {"kind":"contaminant","name":"Mycotoxins","passed":true}]}',
   'https://example.com/demo/coa-AB-2026-014.pdf',
   '3f5a2c1e9b7d4a6f8e0c2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a', 'd4000000-0000-4000-8000-000000000001',
   'active', null, null, '2026-07-14 16:00+00'),
  ('d3000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000003', 'gmp_release',
   'Batch certified for release to the German market by our Qualified Person.',
   '{}', null, null, 'd4000000-0000-4000-8000-000000000002', 'active', null, null, '2026-08-01 11:00+00'),
  ('d3000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000001', 'origin',
   'Grown indoors at our Thun facility from our own mother plants.',
   '{}', null, null, null, 'active', null, null, '2026-07-23 08:00+00'),
  ('d3000000-0000-4000-8000-000000000002', 'd1000000-0000-4000-8000-000000000002', 'lab_result',
   'Release panel. All contaminant checks passed at release.',
   '{"test_date":"2026-04-07","items":[
      {"kind":"cannabinoid","name":"THC","value":21.8,"unit":"%"},
      {"kind":"cannabinoid","name":"CBD","value":0.5,"unit":"%"},
      {"kind":"contaminant","name":"Microbial count","passed":true},
      {"kind":"contaminant","name":"Heavy metals","passed":true}]}',
   'https://example.com/demo/coa-AB-2026-009.pdf', null, 'd4000000-0000-4000-8000-000000000003',
   'revoked', 'A follow-up test on retained samples found the microbial count above the limit.', '2026-06-02 12:00+00',
   '2026-04-07 15:00+00'),
  ('d3000000-0000-4000-8000-000000000003', 'd1000000-0000-4000-8000-000000000001', 'origin',
   'Extracted at our Thun facility.', '{}', null, null, null, 'active', null, null, '2026-10-02 08:00+00');

insert into public.events (lot_id, event_type, occurred_on, place, country, recorded_by_org_id, source, source_system, external_ref) values
  ('d3000000-0000-4000-8000-000000000001', 'cultivation', '2026-04-02', 'Thun', 'CH', null, 'import', 'Track-and-trace system (demo)', 'demo-014-1'),
  ('d3000000-0000-4000-8000-000000000001', 'harvest', '2026-06-18', 'Thun', 'CH', null, 'import', 'Track-and-trace system (demo)', 'demo-014-2'),
  ('d3000000-0000-4000-8000-000000000001', 'processing', '2026-07-06', 'Thun', 'CH', null, 'import', 'Track-and-trace system (demo)', 'demo-014-3'),
  ('d3000000-0000-4000-8000-000000000001', 'testing', '2026-07-14', 'Bern', 'CH', 'd1000000-0000-4000-8000-000000000001', 'manual', null, null),
  ('d3000000-0000-4000-8000-000000000001', 'packaging', '2026-07-22', 'Thun', 'CH', null, 'import', 'Track-and-trace system (demo)', 'demo-014-4'),
  ('d3000000-0000-4000-8000-000000000001', 'shipping', '2026-08-03', 'Thun', 'CH', 'd1000000-0000-4000-8000-000000000001', 'manual', null, null),
  ('d3000000-0000-4000-8000-000000000001', 'receiving', '2026-08-04', 'Hamburg', 'DE', 'd1000000-0000-4000-8000-000000000001', 'manual', null, null),
  ('d3000000-0000-4000-8000-000000000002', 'harvest', '2026-03-11', 'Thun', 'CH', null, 'import', 'Track-and-trace system (demo)', 'demo-009-1'),
  ('d3000000-0000-4000-8000-000000000002', 'packaging', '2026-04-15', 'Thun', 'CH', null, 'import', 'Track-and-trace system (demo)', 'demo-009-2'),
  ('d3000000-0000-4000-8000-000000000003', 'processing', '2026-10-01', 'Thun', 'CH', null, 'import', 'Track-and-trace system (demo)', 'demo-003-1');

-- To remove all demo data:
--   delete from public.organisations where id in (
--     'd1000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000002',
--     'd1000000-0000-4000-8000-000000000003');
