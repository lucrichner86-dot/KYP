-- draft -> published -> recalled, and what each state allows.

select t.as_user('a0000000-0000-4000-8000-00000000000a');

-- A-2 is a draft with one lab result.
select t.fails(format('select public.recall_batch(%L, %L)', (select id from t.ids where key = 'batch_a2'), 'note'),
  'a draft cannot be recalled', '%Only a published batch%');

-- Drafts can be corrected.
insert into t.ids select 'step_a2', public.add_journey_step(
  (select id from t.ids where key = 'batch_a2'), 'packaging', 'Thun', '2026-06-01');
select public.remove_journey_step((select id from t.ids where key = 'step_a2'));
select t.ok((select count(*) = 0 from public.journey_steps j join t.ids i on i.id = j.batch_id where i.key = 'batch_a2'),
  'a journey step can be removed from a draft');

select public.publish_batch((select id from t.ids where key = 'batch_a2'));
select t.ok((select status = 'published' and published_at is not null and recalled_at is null
             from public.batches b join t.ids i on i.id = b.id where i.key = 'batch_a2'),
  'publish moves a draft to published and stamps the time');
select t.fails(format('select public.publish_batch(%L)', (select id from t.ids where key = 'batch_a2')),
  'a published batch cannot be published again', '%Only a draft%');

-- Published: lab results are frozen, the journey can continue.
select t.fails(format($$select public.add_lab_result(%L, 'Lab', '2026-01-01', null, '[{"kind":"contaminant","name":"x","passed":true}]')$$,
    (select id from t.ids where key = 'batch_a2')),
  'no lab result can be added after publishing', '%draft%');
select t.fails(format('select public.remove_lab_result(%L)', (select id from t.ids where key = 'lab_a1')),
  'no lab result can be removed after publishing', '%draft%');
select t.fails(format('select public.remove_journey_step(%L)', (select id from t.ids where key = 'step_a1')),
  'no journey step can be removed after publishing', '%draft%');
insert into t.ids select 'step_a2b', public.add_journey_step(
  (select id from t.ids where key = 'batch_a2'), 'distribution', 'Basel', '2026-06-10');
select t.ok(true, 'a journey step can be added after publishing');

-- Recall.
select t.fails(format('select public.recall_batch(%L, %L)', (select id from t.ids where key = 'batch_a2'), '   '),
  'a recall needs a note', '%needs a note%');
select public.recall_batch((select id from t.ids where key = 'batch_a2'), '  Recalled for the test.  ');
select t.ok((select status = 'recalled' and recalled_at is not null and recall_note = 'Recalled for the test.'
             from public.batches b join t.ids i on i.id = b.id where i.key = 'batch_a2'),
  'recall moves a published batch to recalled with the note');

-- Recalled is final.
select t.fails(format('select public.recall_batch(%L, %L)', (select id from t.ids where key = 'batch_a2'), 'again'),
  'a recalled batch cannot be recalled again', '%Only a published batch%');
select t.fails(format('select public.publish_batch(%L)', (select id from t.ids where key = 'batch_a2')),
  'a recalled batch cannot be published again', '%Only a draft%');
select t.fails(format($$select public.add_journey_step(%L, 'distribution', 'Basel', '2026-06-11')$$,
    (select id from t.ids where key = 'batch_a2')),
  'a recalled batch takes no more journey steps', '%recalled%');

-- The public sees the new state straight away.
reset role;
create temp table a2 as select passport_code as code from public.batches b join t.ids i on i.id = b.id where i.key = 'batch_a2';
grant select on a2 to anon;
select t.as_public();
select t.ok((select public.get_passport(code) ->> 'status' = 'recalled' from a2),
  'the public passport shows the recall');
reset role;
