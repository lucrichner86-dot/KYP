-- The seed loads and the demo records behave.
reset role;
\ir ../seed.sql
select t.as_public();
select t.ok((select j ->> 'status' = 'published'
                and (select count(distinct a ->> 'level') from jsonb_array_elements(j -> 'attestations') a) >= 3
             from (select public.get_record('demo-kyp-flower-014') as j) s),
  'the demo record works and shows several assurance levels');
select t.ok((select public.get_record('demo-kyp-flower-009') ->> 'status' = 'recalled'),
  'the recalled demo record works');
select t.ok(public.get_record('demo-kyp-extract-003') is null, 'the draft demo lot is not public');
reset role;
