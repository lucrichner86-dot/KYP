-- Demo data: one producer, two products, three batches (one recalled, one
-- still a draft). Everything here is invented. Run once, after the migrations.
-- The demo producer has no members; it exists so the demo passports work.

insert into public.producers (id, name, country, website) values
  ('d0000000-0000-4000-8000-000000000001', 'Alpenblick Pharma AG (demo)', 'CH', null);

insert into public.products (id, producer_id, name, product_type, cultivar, description) values
  ('d0000000-0000-4000-8000-000000000011', 'd0000000-0000-4000-8000-000000000001',
   'Alpenblick 22/1', 'flower', 'Demo cultivar A',
   'Dried cannabis flower, 10 g, in a sealed container.'),
  ('d0000000-0000-4000-8000-000000000012', 'd0000000-0000-4000-8000-000000000001',
   'Alpenblick Extract 10/10', 'extract', null,
   'Full-spectrum cannabis extract in MCT oil, 30 ml bottle.');

insert into public.batches (
  id, producer_id, product_id, batch_number, harvest_date, packaging_date,
  origin_grower, origin_place, origin_country, status, recall_note, passport_code,
  published_at, recalled_at
) values
  ('d0000000-0000-4000-8000-000000000021', 'd0000000-0000-4000-8000-000000000001',
   'd0000000-0000-4000-8000-000000000011', 'AB-2026-014', '2026-06-18', '2026-07-22',
   'Alpenblick indoor facility', 'Thun', 'CH', 'published', null,
   'demo-flower-2026-014', '2026-08-03 09:00+00', null),
  ('d0000000-0000-4000-8000-000000000022', 'd0000000-0000-4000-8000-000000000001',
   'd0000000-0000-4000-8000-000000000011', 'AB-2026-009', '2026-03-11', '2026-04-15',
   'Alpenblick indoor facility', 'Thun', 'CH', 'recalled',
   'Recalled by the producer on 2 June 2026: a follow-up test found the microbial count above the limit. Do not use packs from this batch. Return them to the pharmacy that dispensed them.',
   'demo-flower-2026-009', '2026-04-28 09:00+00', '2026-06-02 14:30+00'),
  ('d0000000-0000-4000-8000-000000000023', 'd0000000-0000-4000-8000-000000000001',
   'd0000000-0000-4000-8000-000000000012', 'AX-2026-003', '2026-08-05', '2026-10-01',
   'Alpenblick indoor facility', 'Thun', 'CH', 'draft', null,
   'demo-extract-2026-003', null, null);

insert into public.lab_results (id, batch_id, lab_name, test_date, coa_url) values
  ('d0000000-0000-4000-8000-000000000031', 'd0000000-0000-4000-8000-000000000021',
   'Helvetia Analytik GmbH (demo)', '2026-07-14', 'https://example.com/coa/AB-2026-014.pdf'),
  ('d0000000-0000-4000-8000-000000000032', 'd0000000-0000-4000-8000-000000000022',
   'Helvetia Analytik GmbH (demo)', '2026-04-07', 'https://example.com/coa/AB-2026-009.pdf'),
  ('d0000000-0000-4000-8000-000000000033', 'd0000000-0000-4000-8000-000000000023',
   'Helvetia Analytik GmbH (demo)', '2026-09-22', null);

insert into public.lab_result_items (lab_result_id, kind, name, value, unit, passed, sort_order) values
  ('d0000000-0000-4000-8000-000000000031', 'cannabinoid', 'THC', 22.4, '%', null, 1),
  ('d0000000-0000-4000-8000-000000000031', 'cannabinoid', 'CBD', 0.6, '%', null, 2),
  ('d0000000-0000-4000-8000-000000000031', 'cannabinoid', 'CBG', 0.9, '%', null, 3),
  ('d0000000-0000-4000-8000-000000000031', 'terpene', 'Myrcene', 0.82, '%', null, 4),
  ('d0000000-0000-4000-8000-000000000031', 'terpene', 'Limonene', 0.41, '%', null, 5),
  ('d0000000-0000-4000-8000-000000000031', 'terpene', 'Caryophyllene', 0.37, '%', null, 6),
  ('d0000000-0000-4000-8000-000000000031', 'contaminant', 'Microbial count', null, null, true, 7),
  ('d0000000-0000-4000-8000-000000000031', 'contaminant', 'Heavy metals', null, null, true, 8),
  ('d0000000-0000-4000-8000-000000000031', 'contaminant', 'Pesticides', null, null, true, 9),
  ('d0000000-0000-4000-8000-000000000031', 'contaminant', 'Mycotoxins', null, null, true, 10),
  ('d0000000-0000-4000-8000-000000000032', 'cannabinoid', 'THC', 21.8, '%', null, 1),
  ('d0000000-0000-4000-8000-000000000032', 'cannabinoid', 'CBD', 0.5, '%', null, 2),
  ('d0000000-0000-4000-8000-000000000032', 'terpene', 'Myrcene', 0.77, '%', null, 3),
  ('d0000000-0000-4000-8000-000000000032', 'contaminant', 'Microbial count', null, null, true, 4),
  ('d0000000-0000-4000-8000-000000000032', 'contaminant', 'Heavy metals', null, null, true, 5),
  ('d0000000-0000-4000-8000-000000000032', 'contaminant', 'Pesticides', null, null, true, 6),
  ('d0000000-0000-4000-8000-000000000033', 'cannabinoid', 'THC', 10.1, 'mg/ml', null, 1),
  ('d0000000-0000-4000-8000-000000000033', 'cannabinoid', 'CBD', 9.8, 'mg/ml', null, 2),
  ('d0000000-0000-4000-8000-000000000033', 'contaminant', 'Residual solvents', null, null, true, 3);

insert into public.journey_steps (batch_id, stage, place, step_date) values
  ('d0000000-0000-4000-8000-000000000021', 'cultivation', 'Thun, Switzerland', '2026-04-02'),
  ('d0000000-0000-4000-8000-000000000021', 'harvest', 'Thun, Switzerland', '2026-06-18'),
  ('d0000000-0000-4000-8000-000000000021', 'processing', 'Thun, Switzerland', '2026-07-06'),
  ('d0000000-0000-4000-8000-000000000021', 'testing', 'Bern, Switzerland', '2026-07-14'),
  ('d0000000-0000-4000-8000-000000000021', 'packaging', 'Thun, Switzerland', '2026-07-22'),
  ('d0000000-0000-4000-8000-000000000021', 'distribution', 'Basel, Switzerland', '2026-08-04'),
  ('d0000000-0000-4000-8000-000000000022', 'cultivation', 'Thun, Switzerland', '2025-12-20'),
  ('d0000000-0000-4000-8000-000000000022', 'harvest', 'Thun, Switzerland', '2026-03-11'),
  ('d0000000-0000-4000-8000-000000000022', 'testing', 'Bern, Switzerland', '2026-04-07'),
  ('d0000000-0000-4000-8000-000000000022', 'packaging', 'Thun, Switzerland', '2026-04-15'),
  ('d0000000-0000-4000-8000-000000000022', 'distribution', 'Basel, Switzerland', '2026-04-29'),
  ('d0000000-0000-4000-8000-000000000023', 'harvest', 'Thun, Switzerland', '2026-08-05');
