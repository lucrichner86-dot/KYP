-- Who can see and change what.

-- Boris: another producer.
select t.as_user('b0000000-0000-4000-8000-00000000000b');
select t.ok((select count(*) = 1 and bool_and(lot_number = 'B-1') from public.lots),
  'a producer sees only their own lots');
select t.ok((select count(*) = 1 from public.products), 'a producer sees only their own products');
select t.ok((select count(*) = 1 from public.events), 'a producer sees only events of their own lots');
select t.ok((select count(*) = 0 from public.attestations), 'a producer sees no statements on others'' lots');
select t.ok((select count(*) = 0 from public.attestation_requests), 'a producer sees no requests between others');
select t.ok((select count(*) = 5 from public.organisations), 'signed-in users can read the organisation directory');
select t.ok((select count(*) = 0 from public.organisation_reviews), 'reviews are admin-only');

select t.fails($$select public.record_event(t.id('lot_a2'), 'harvest', '2026-01-01', 'X')$$,
  'cannot record an event on another organisation''s lot', '%not yours%');
select t.fails($$select public.publish_lot(t.id('lot_a2'))$$,
  'cannot publish another organisation''s lot', '%not yours%');
select t.fails($$select public.recall_lot(t.id('lot_a1'), 'sabotage')$$,
  'cannot recall another organisation''s lot', '%not yours%');
select t.fails($$select public.issue_attestation(t.id('org_b'), t.id('lot_a2'), 'other', 'unsolicited')$$,
  'cannot issue an unrequested statement on another organisation''s lot', '%not yours%');
select t.fails($$select public.issue_attestation(t.id('org_a'), t.id('lot_a2'), 'other', 'as someone else')$$,
  'cannot issue a statement in another organisation''s name', '%not yours%');
select t.fails($$select public.revoke_attestation(t.id('att_a1_lab'), 'x')$$,
  'cannot revoke another organisation''s statement', '%not yours%');
select t.fails($$select public.decline_attestation_request(t.id('req_a1_gmp'), 'x')$$,
  'cannot decline a request addressed to someone else', '%not yours%');
select t.fails($$select public.add_product(t.id('org_a'), 'Intruder', 'other')$$,
  'cannot add a product to another organisation', '%not yours%');
select t.fails($$update public.lots set status = 'published', published_at = now()$$,
  'no direct table writes', '%permission denied%');
select t.fails($$insert into public.organisation_members (org_id, user_id) select t.id('org_a'), 'b0000000-0000-4000-8000-00000000000b'$$,
  'cannot add oneself to another organisation', '%permission denied%');

-- Lena: the lab sees the lots it was asked about, and only that.
select t.as_user('1e000000-0000-4000-8000-00000000001e');
select t.ok((select count(*) = 2 and bool_and(lot_number in ('A-1', 'A-2')) from public.lots),
  'a lab sees exactly the lots it was asked to attest');
select t.ok((select count(*) = 1 and bool_and(name = 'Flower A') from public.products),
  'a lab sees the product of those lots');
select t.fails($$select public.record_event(t.id('lot_a2'), 'harvest', '2026-01-01', 'X')$$,
  'a lab cannot record events on the producer''s lot', '%not yours%');
select t.fails($$select public.publish_lot(t.id('lot_a2'))$$,
  'a lab cannot publish the producer''s lot', '%not yours%');
select t.fails($$select public.issue_attestation(t.id('org_l'), t.id('lot_b1'), 'lab_result', 'x',
    '{"test_date":"2026-05-28","items":[{"kind":"contaminant","name":"x","passed":true}]}')$$,
  'a lab cannot attest a lot it was not asked about', '%not yours%');

-- Anna cannot remove what the lab said.
select t.as_user('a0000000-0000-4000-8000-00000000000a');
select t.fails($$select public.revoke_attestation(t.id('att_a1_lab'), 'I do not like it')$$,
  'the owner cannot revoke a third party''s statement', '%not yours%');
select t.fails('delete from public.attestations', 'the owner cannot delete statements', '%permission denied%');
select t.ok((select count(*) = 4 from public.attestations a join t.ids i on i.id = a.lot_id where i.key in ('lot_a1', 'lot_a2')),
  'the owner sees all statements on their lots');

-- Kim, the admin, sees everything.
select t.as_user('c0000000-0000-4000-8000-00000000000c');
select t.ok((select count(*) = 5 from public.lots) and (select count(*) = 4 from public.organisation_reviews),
  'an admin sees all lots and reviews');
reset role;
