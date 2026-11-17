-- What anyone with a code can see, and the assurance level of each fact.

reset role;
create table t.codes as select i.key, l.public_code as code from public.lots l join t.ids i on i.id = l.id;
grant select on t.codes to anon, authenticated;
create function t.code(p_key text) returns text language sql stable as $$ select code from t.codes where key = p_key $$;
grant execute on function t.code(text) to anon, authenticated;

select t.as_public();

select t.fails('select * from public.lots', 'public cannot select lots', '%permission denied%');
select t.fails('select * from public.organisations', 'public cannot select organisations', '%permission denied%');
select t.fails('select * from public.attestations', 'public cannot select attestations', '%permission denied%');
select t.fails('select * from public.events', 'public cannot select events', '%permission denied%');
select t.fails('select * from public.scan_log', 'public cannot select the scan log', '%permission denied%');
select t.fails('select * from public.organisation_reviews', 'public cannot select reviews', '%permission denied%');

select t.ok(public.get_record(t.code('lot_a2')) is null, 'a draft is not public');
select t.ok(public.get_record(t.code('lot_b1')) is null, 'another draft is not public');
select t.ok(public.get_record('nope-nope-nope-nope') is null, 'an unknown code returns nothing');

create temp table r as select public.get_record(t.code('lot_a1')) as j;

select t.ok((select j ->> 'status' = 'published' and j ->> 'lot_number' = 'A-1'
                 and j -> 'product' ->> 'name' = 'Flower A'
                 and j -> 'owner' ->> 'name' = 'Producer A' and j -> 'owner' ->> 'status' = 'verified'
             from r), 'a published record shows product and owner');

select t.ok((select a ->> 'level' = 'accredited'
                 and a -> 'issuer' ->> 'name' = 'Lab L'
                 and a -> 'issuer' -> 'accreditations' -> 0 ->> 'standard' = 'ISO/IEC 17025'
                 and jsonb_array_length(a -> 'claim' -> 'items') = 3
             from r, jsonb_array_elements(j -> 'attestations') a where a ->> 'kind' = 'lab_result'),
  'the lab result from an accredited lab is "accredited", with the accreditation shown');
select t.ok((select a ->> 'level' = 'independent'
             from r, jsonb_array_elements(j -> 'attestations') a where a ->> 'kind' = 'gmp_release'),
  'a verified importer without accreditation is "independent"');
select t.ok((select a ->> 'level' = 'self_declared'
             from r, jsonb_array_elements(j -> 'attestations') a where a ->> 'kind' = 'origin'),
  'the owner''s own statement is "self_declared"');
select t.ok((select count(*) filter (where e ->> 'level' = 'system_recorded') = 1
                and count(*) filter (where e ->> 'level' = 'self_declared') = 1
             from r, jsonb_array_elements(j -> 'events') e),
  'imported events are "system_recorded", manual ones "self_declared"');
select t.ok((select not (j ? 'id') and not (j -> 'owner' ? 'id') and position('external_ref' in j::text) = 0 from r),
  'the record exposes no internal ids or external references');

select t.ok((select j ->> 'status' = 'recalled' and j ->> 'recall_note' = 'Recalled: test note.'
             from (select public.get_record(t.code('lot_a3')) as j) s),
  'a recalled record shows the recall note');

select t.fails($$select public.publish_lot(t.id('lot_a2'))$$, 'public cannot publish', '%permission denied%');
select t.fails($$select public.import_event(t.id('lot_a2'), 'x', 'y', 'harvest', '2026-01-01', 'z')$$,
  'public cannot import events', '%permission denied%');

reset role;
select t.ok((select count(*) from public.scan_log) = 2, 'each public view is logged once (A-1 and A-3)');
select t.ok((select array_agg(column_name::text order by ordinal_position) = array['id', 'lot_id', 'scanned_at']
             from information_schema.columns where table_schema = 'public' and table_name = 'scan_log'),
  'the scan log holds only lot and time');
