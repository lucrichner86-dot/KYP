-- Two producers, each built by its own user through the same functions the
-- back office calls. Later files reuse these rows.
--   Anna  -> producer A: batch A-1 (published), A-2 (draft), A-3 (recalled)
--   Boris -> producer B: batch B-1 (draft)

insert into auth.users (id, email) values
  ('a0000000-0000-4000-8000-00000000000a', 'anna@example.com'),
  ('b0000000-0000-4000-8000-00000000000b', 'boris@example.com');

create table t.ids (key text primary key, id uuid not null);
grant select, insert on t.ids to authenticated, anon;

select t.as_user('a0000000-0000-4000-8000-00000000000a');

insert into t.ids select 'producer_a', public.create_producer('Producer A', 'ch');
select t.fails($$select public.create_producer('Second one', 'CH')$$,
  'an account cannot create a second producer', '%already belongs%');

insert into t.ids select 'product_a',
  public.add_product((select id from t.ids where key = 'producer_a'), 'Flower A', 'flower', 'Cultivar', null);

insert into t.ids select 'batch_a1',
  public.create_batch((select id from t.ids where key = 'product_a'), 'A-1', '2026-05-01', '2026-06-01', 'Grower', 'Thun', 'CH');
insert into t.ids select 'batch_a2',
  public.create_batch((select id from t.ids where key = 'product_a'), 'A-2');
insert into t.ids select 'batch_a3',
  public.create_batch((select id from t.ids where key = 'product_a'), 'A-3');
select t.fails($$select public.create_batch((select id from t.ids where key = 'product_a'), 'A-1')$$,
  'a batch number is unique per producer', '%already exists%');

select t.fails(
  $$select public.publish_batch((select id from t.ids where key = 'batch_a1'))$$,
  'a batch without a lab result cannot be published', '%lab result%');

insert into t.ids select 'lab_a1', public.add_lab_result(
  (select id from t.ids where key = 'batch_a1'), 'Lab One', '2026-05-20', 'https://example.com/coa.pdf',
  '[{"kind":"cannabinoid","name":"THC","value":20.5,"unit":"%"},
    {"kind":"terpene","name":"Myrcene","value":0.7,"unit":"%"},
    {"kind":"contaminant","name":"Heavy metals","passed":true}]');
select public.add_lab_result(
  (select id from t.ids where key = 'batch_a2'), 'Lab One', '2026-05-20', null,
  '[{"kind":"cannabinoid","name":"THC","value":18,"unit":"%"}]');
select public.add_lab_result(
  (select id from t.ids where key = 'batch_a3'), 'Lab One', '2026-05-20', null,
  '[{"kind":"contaminant","name":"Pesticides","passed":true}]');
select t.fails(
  $$select public.add_lab_result((select id from t.ids where key = 'batch_a2'), 'Lab', '2026-05-20', null,
      '[{"kind":"contaminant","name":"Pesticides","value":3,"unit":"%"}]')$$,
  'a contaminant check needs pass/fail, not a value');
select t.fails(
  $$select public.add_lab_result((select id from t.ids where key = 'batch_a2'), 'Lab', '2026-05-20', 'http://insecure.example/coa.pdf',
      '[{"kind":"cannabinoid","name":"THC","value":18,"unit":"%"}]')$$,
  'a certificate link must be https');

insert into t.ids select 'step_a1', public.add_journey_step(
  (select id from t.ids where key = 'batch_a1'), 'harvest', 'Thun', '2026-05-01');

select public.publish_batch((select id from t.ids where key = 'batch_a1'));
select public.publish_batch((select id from t.ids where key = 'batch_a3'));
select public.recall_batch((select id from t.ids where key = 'batch_a3'), 'Recalled: test note.');

select t.as_user('b0000000-0000-4000-8000-00000000000b');

insert into t.ids select 'producer_b', public.create_producer('Producer B', 'DE');
insert into t.ids select 'product_b',
  public.add_product((select id from t.ids where key = 'producer_b'), 'Flower B', 'flower');
insert into t.ids select 'batch_b1',
  public.create_batch((select id from t.ids where key = 'product_b'), 'B-1');
insert into t.ids select 'lab_b1', public.add_lab_result(
  (select id from t.ids where key = 'batch_b1'), 'Lab Two', '2026-05-21', null,
  '[{"kind":"cannabinoid","name":"CBD","value":9,"unit":"%"}]');
insert into t.ids select 'step_b1', public.add_journey_step(
  (select id from t.ids where key = 'batch_b1'), 'harvest', 'Kassel', '2026-05-02');

reset role;
select t.ok((select count(*) = 4 and count(distinct passport_code) = 4
                    and bool_and(passport_code ~ '^[0-9a-hjkmnp-tv-z]{20}$') from public.batches),
  'generated passport codes are unique, 20 base32 characters');
