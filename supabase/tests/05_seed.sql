-- The seed file loads and the demo passports behave. The codes here are the
-- ones the landing page links to.

reset role;
\ir ../seed.sql

select t.as_public();
select t.ok(
  (select p ->> 'status' = 'published' and p -> 'product' ->> 'name' = 'Alpenblick 22/1'
      and jsonb_array_length(p -> 'lab_results' -> 0 -> 'items') = 10
      and jsonb_array_length(p -> 'journey') = 6
   from (select public.get_passport('demo-flower-2026-014') as p) s),
  'the demo passport works');
select t.ok(
  (select p ->> 'status' = 'recalled' and length(p ->> 'recall_note') > 0
   from (select public.get_passport('demo-flower-2026-009') as p) s),
  'the recalled demo passport works');
select t.ok(public.get_passport('demo-extract-2026-003') is null, 'the draft demo batch is not public');
reset role;
