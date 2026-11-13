-- What someone with no account can and cannot see.

reset role;
create temp table codes as
  select i.key, b.passport_code as code from public.batches b join t.ids i on i.id = b.id;
grant select on codes to anon, authenticated;

select t.as_public();

-- No direct table access, so codes cannot be listed.
select t.fails('select * from public.batches', 'public cannot select from batches', '%permission denied%');
select t.fails('select * from public.producers', 'public cannot select from producers', '%permission denied%');
select t.fails('select * from public.products', 'public cannot select from products', '%permission denied%');
select t.fails('select * from public.lab_results', 'public cannot select from lab_results', '%permission denied%');
select t.fails('select * from public.lab_result_items', 'public cannot select from lab_result_items', '%permission denied%');
select t.fails('select * from public.journey_steps', 'public cannot select from journey_steps', '%permission denied%');
select t.fails('select * from public.scan_log', 'public cannot select from scan_log', '%permission denied%');
select t.fails('select * from public.producer_members', 'public cannot select from producer_members', '%permission denied%');

-- Drafts and unknown codes look the same: nothing.
select t.ok(public.get_passport((select code from codes where key = 'batch_a2')) is null,
  'public cannot read a draft by its code');
select t.ok(public.get_passport((select code from codes where key = 'batch_b1')) is null,
  'public cannot read another draft by its code');
select t.ok(public.get_passport('no-such-code-anywhere') is null, 'an unknown code returns nothing');
select t.ok(public.get_passport(null) is null, 'a null code returns nothing');

-- Published.
select t.ok(
  (select p ->> 'status' = 'published'
      and p ->> 'batch_number' = 'A-1'
      and p -> 'product' ->> 'name' = 'Flower A'
      and p -> 'producer' ->> 'name' = 'Producer A'
      and p ->> 'origin_country' = 'CH'
      and p ->> 'source' = 'manual'
      and jsonb_array_length(p -> 'lab_results') = 1
      and jsonb_array_length(p -> 'lab_results' -> 0 -> 'items') = 3
      and p -> 'lab_results' -> 0 ->> 'coa_url' = 'https://example.com/coa.pdf'
      and jsonb_array_length(p -> 'journey') = 1
   from (select public.get_passport((select code from codes where key = 'batch_a1')) as p) s),
  'public can read a published batch with product, producer, lab results and journey');
select t.ok(
  (select not (p ? 'id') and not (p ? 'producer_id') and not (p ? 'external_ref')
   from (select public.get_passport((select code from codes where key = 'batch_a1')) as p) s),
  'the passport exposes no internal ids');

-- Recalled.
select t.ok(
  (select p ->> 'status' = 'recalled' and p ->> 'recall_note' = 'Recalled: test note.'
      and p ->> 'recalled_at' is not null
   from (select public.get_passport((select code from codes where key = 'batch_a3')) as p) s),
  'public can read a recalled batch with its recall note');

-- The public cannot change anything.
select t.fails($$select public.create_producer('Anon', 'CH')$$,
  'public cannot create a producer', '%permission denied%');
select t.fails(format('select public.publish_batch(%L)', (select id from t.ids where key = 'batch_a2')),
  'public cannot publish', '%permission denied%');
select t.fails(format('select public.recall_batch(%L, %L)', (select id from t.ids where key = 'batch_a1'), 'x'),
  'public cannot recall', '%permission denied%');
select t.fails($$insert into public.scan_log (batch_id) select id from t.ids where key = 'batch_a1'$$,
  'public cannot write the scan log directly', '%permission denied%');

-- Scan log: three successful public reads above (A-1 twice, A-3 once),
-- none for drafts or unknown codes, and no personal data columns.
reset role;
select t.ok((select count(*) from public.scan_log) = 3, 'each public passport view is logged once');
select t.ok((select count(*) from public.scan_log s join t.ids i on i.id = s.batch_id
             where i.key in ('batch_a2', 'batch_b1')) = 0, 'draft lookups are not logged');
select t.ok(
  (select array_agg(column_name::text order by ordinal_position) = array['id', 'batch_id', 'scanned_at']
   from information_schema.columns where table_schema = 'public' and table_name = 'scan_log'),
  'the scan log holds only batch and time');
