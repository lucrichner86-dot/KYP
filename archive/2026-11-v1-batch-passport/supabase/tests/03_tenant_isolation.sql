-- Boris (producer B) against Anna's data (producer A), and the other way.

select t.as_user('b0000000-0000-4000-8000-00000000000b');

-- Reads: only own rows.
select t.ok((select count(*) = 1 and bool_and(name = 'Producer B') from public.producers),
  'a member sees only their own producer');
select t.ok((select count(*) = 1 from public.producer_members), 'a member sees only their own membership');
select t.ok((select count(*) = 1 and bool_and(name = 'Flower B') from public.products),
  'a member sees only their own products');
select t.ok((select count(*) = 1 and bool_and(batch_number = 'B-1') from public.batches),
  'a member sees only their own batches (not even published ones of others)');
select t.ok((select count(*) = 1 and bool_and(lab_name = 'Lab Two') from public.lab_results),
  'a member sees only their own lab results');
select t.ok((select count(*) = 1 and bool_and(name = 'CBD') from public.lab_result_items),
  'a member sees only their own lab result items');
select t.ok((select count(*) = 1 and bool_and(place = 'Kassel') from public.journey_steps),
  'a member sees only their own journey steps');
select t.ok((select count(*) = 0 from public.scan_log), 'a member sees no scans of other producers'' batches');

-- Writes through functions: refused for another producer's data.
select t.fails(format('select public.add_product(%L, %L, %L)', (select id from t.ids where key = 'producer_a'), 'Intruder', 'flower'),
  'cannot add a product to another producer', '%not yours%');
select t.fails(format('select public.create_batch(%L, %L)', (select id from t.ids where key = 'product_a'), 'X-1'),
  'cannot create a batch on another producer''s product', '%not yours%');
select t.fails(format($$select public.add_lab_result(%L, 'Lab', '2026-01-01', null, '[{"kind":"contaminant","name":"x","passed":true}]')$$,
    (select id from t.ids where key = 'batch_a2')),
  'cannot add a lab result to another producer''s batch', '%not yours%');
select t.fails(format('select public.remove_lab_result(%L)', (select id from t.ids where key = 'lab_a1')),
  'cannot remove another producer''s lab result', '%not yours%');
select t.fails(format($$select public.add_journey_step(%L, 'harvest', 'Somewhere', '2026-01-01')$$,
    (select id from t.ids where key = 'batch_a2')),
  'cannot add a journey step to another producer''s batch', '%not yours%');
select t.fails(format('select public.remove_journey_step(%L)', (select id from t.ids where key = 'step_a1')),
  'cannot remove another producer''s journey step', '%not yours%');
select t.fails(format('select public.publish_batch(%L)', (select id from t.ids where key = 'batch_a2')),
  'cannot publish another producer''s batch', '%not yours%');
select t.fails(format('select public.recall_batch(%L, %L)', (select id from t.ids where key = 'batch_a1'), 'sabotage'),
  'cannot recall another producer''s batch', '%not yours%');

-- Direct table writes: refused even on own rows.
select t.fails($$update public.batches set status = 'published', published_at = now()$$,
  'no direct update of batches', '%permission denied%');
select t.fails($$insert into public.producer_members (producer_id, user_id)
    select id, 'b0000000-0000-4000-8000-00000000000b' from t.ids where key = 'producer_a'$$,
  'cannot add oneself to another producer', '%permission denied%');
select t.fails('delete from public.lab_results', 'no direct delete of lab results', '%permission denied%');
select t.fails($$insert into public.products (producer_id, name, product_type)
    select id, 'Direct', 'flower' from t.ids where key = 'producer_b'$$,
  'no direct insert of products', '%permission denied%');

-- The other way round, and the scan log.
select t.as_user('a0000000-0000-4000-8000-00000000000a');
select t.ok((select count(*) = 3 from public.batches), 'the other member sees their three batches');
select t.ok((select count(*) = 3 from public.scan_log), 'a member sees the scans of their own batches');

-- A signed-in user with no producer sees nothing.
reset role;
insert into auth.users (id, email) values ('c0000000-0000-4000-8000-00000000000c', 'carla@example.com');
select t.as_user('c0000000-0000-4000-8000-00000000000c');
select t.ok((select count(*) = 0 from public.producers) and (select count(*) = 0 from public.batches),
  'a signed-in user without a producer sees no rows');

-- Nothing was changed by any of the refused calls.
reset role;
select t.ok((select status = 'draft' from public.batches b join t.ids i on i.id = b.id where i.key = 'batch_a2')
        and (select status = 'published' from public.batches b join t.ids i on i.id = b.id where i.key = 'batch_a1')
        and (select count(*) = 1 from public.products p join t.ids i on i.id = p.producer_id where i.key = 'producer_a'),
  'refused calls left the other producer''s data unchanged');
