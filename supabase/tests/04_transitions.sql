-- Lifecycle, revocation and suspension.

select t.as_user('a0000000-0000-4000-8000-00000000000a');

select t.fails($$select public.recall_lot(t.id('lot_a2'), 'note')$$,
  'a draft cannot be recalled', '%Only a published%');
insert into t.ids select 'event_a2', public.record_event(t.id('lot_a2'), 'packaging', '2026-06-01', 'Thun');
select public.remove_event(t.id('event_a2'));
select t.ok((select count(*) = 0 from public.events where lot_id = t.id('lot_a2')),
  'a manual event can be removed from a draft');
select t.fails($$select public.remove_event(t.id('event_a1_import'))$$,
  'an imported event cannot be removed', '%draft%');

select public.publish_lot(t.id('lot_a2'));
select t.ok((select status = 'published' and published_at is not null from public.lots where id = t.id('lot_a2')),
  'publish moves a draft to published');
select t.fails($$select public.publish_lot(t.id('lot_a2'))$$, 'cannot publish twice', '%Only a draft%');
select t.fails($$select public.remove_event(t.id('event_a1'))$$,
  'events cannot be removed after publishing', '%draft%');
select public.record_event(t.id('lot_a2'), 'shipping', '2026-06-10', 'Basel', 'CH');
select t.ok(true, 'events can still be added after publishing');

-- The lab revokes its statement on A-1: it stays on the record, marked revoked.
select t.as_user('1e000000-0000-4000-8000-00000000001e');
select t.fails($$select public.revoke_attestation(t.id('att_a1_lab'), ' ')$$,
  'a revocation needs a reason', '%Say why%');
select public.revoke_attestation(t.id('att_a1_lab'), 'Sample mix-up at the lab; retest pending.');
select t.as_public();
select t.ok((select a ->> 'status' = 'revoked' and a ->> 'revoked_reason' like 'Sample mix-up%'
             from jsonb_array_elements(public.get_record(t.code('lot_a1')) -> 'attestations') a
             where a ->> 'kind' = 'lab_result'),
  'a revoked statement stays on the public record, marked revoked');

-- KYP suspends the importer: its statements drop to "unverified" and it cannot issue more.
select t.as_user('c0000000-0000-4000-8000-00000000000c');
select public.review_organisation(t.id('org_i'), 'suspended', 'Licence withdrawn by the authority.');
select t.as_public();
select t.ok((select a ->> 'level' = 'unverified'
             from jsonb_array_elements(public.get_record(t.code('lot_a1')) -> 'attestations') a
             where a ->> 'kind' = 'gmp_release'),
  'statements by a suspended organisation show as "unverified"');
select t.as_user('a0000000-0000-4000-8000-00000000000a');
select t.fails($$select public.request_attestation(t.id('lot_a2'), t.id('org_i'), 'gmp_release')$$,
  'no new requests to a suspended organisation', '%verified%');

-- KYP withdraws the lab's accreditation: its (active) lab results become "independent".
select t.as_user('c0000000-0000-4000-8000-00000000000c');
select public.withdraw_accreditation(t.id('accr_l'));
select t.as_public();
select t.ok((select a ->> 'level' = 'independent'
             from jsonb_array_elements(public.get_record(t.code('lot_a2')) -> 'attestations') a
             where a ->> 'kind' = 'lab_result'),
  'withdrawing an accreditation lowers the level of that issuer''s statements');

-- Recall.
select t.as_user('a0000000-0000-4000-8000-00000000000a');
select t.fails($$select public.recall_lot(t.id('lot_a2'), '  ')$$, 'a recall needs a note', '%needs a note%');
select public.recall_lot(t.id('lot_a2'), '  Recalled for the test.  ');
select t.ok((select status = 'recalled' and recall_note = 'Recalled for the test.' from public.lots where id = t.id('lot_a2')),
  'recall moves a published lot to recalled');
select t.fails($$select public.recall_lot(t.id('lot_a2'), 'again')$$, 'cannot recall twice', '%Only a published%');
select t.fails($$select public.publish_lot(t.id('lot_a2'))$$, 'cannot republish a recalled lot', '%Only a draft%');
select t.fails($$select public.record_event(t.id('lot_a2'), 'shipping', '2026-06-11', 'Basel')$$,
  'a recalled lot takes no more events', '%recalled%');
select t.fails($$select public.issue_attestation(t.id('org_a'), t.id('lot_a2'), 'other', 'late')$$,
  'a recalled lot takes no more statements', '%recalled%');
select t.as_public();
select t.ok((select public.get_record(t.code('lot_a2')) ->> 'status' = 'recalled'),
  'the public record shows the recall');
reset role;
