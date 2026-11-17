-- Users and organisations, built through the same functions the app calls.
--   Anna  -> Producer A (verified)      lots A-1 (published), A-2 (draft), A-3 (recalled)
--   Boris -> Producer B (verified)      lot B-1 (draft)
--   Lena  -> Lab L (verified, ISO/IEC 17025 covering lab_result)
--   Ivo   -> Importer I (verified, no accreditation)
--   Paul  -> Producer P (pending, never verified)
--   Kim   -> KYP admin

insert into auth.users (id, email) values
  ('a0000000-0000-4000-8000-00000000000a', 'anna@example.com'),
  ('b0000000-0000-4000-8000-00000000000b', 'boris@example.com'),
  ('1e000000-0000-4000-8000-00000000001e', 'lena@example.com'),
  ('10000000-0000-4000-8000-000000000010', 'ivo@example.com'),
  ('90000000-0000-4000-8000-000000000090', 'paul@example.com'),
  ('c0000000-0000-4000-8000-00000000000c', 'kim@example.com');
insert into public.kyp_admins (user_id) values ('c0000000-0000-4000-8000-00000000000c');

create table t.ids (key text primary key, id uuid not null);
grant select, insert on t.ids to authenticated, anon, service_role;
create function t.id(p_key text) returns uuid language sql stable as $$ select id from t.ids where key = p_key $$;
grant execute on function t.id(text) to authenticated, anon, service_role;

-- Organisations sign up.
select t.as_user('a0000000-0000-4000-8000-00000000000a');
insert into t.ids select 'org_a', public.create_organisation('Producer A', 'producer', 'ch');
select public.add_organisation_identifier(t.id('org_a'), 'trade_register', 'CHE-000.000.001');
select t.fails($$select public.create_organisation('Second', 'producer', 'CH')$$,
  'an account cannot create a second organisation', '%already belongs%');

select t.as_user('b0000000-0000-4000-8000-00000000000b');
insert into t.ids select 'org_b', public.create_organisation('Producer B', 'producer', 'DE');
select t.as_user('1e000000-0000-4000-8000-00000000001e');
insert into t.ids select 'org_l', public.create_organisation('Lab L', 'laboratory', 'CH');
select t.as_user('10000000-0000-4000-8000-000000000010');
insert into t.ids select 'org_i', public.create_organisation('Importer I', 'importer', 'DE');
select t.as_user('90000000-0000-4000-8000-000000000090');
insert into t.ids select 'org_p', public.create_organisation('Producer P', 'producer', 'NL');

select t.ok((select bool_and(status = 'pending') from public.organisations), 'new organisations start pending');

-- A non-admin cannot verify anyone, including themselves.
select t.as_user('a0000000-0000-4000-8000-00000000000a');
select t.fails($$select public.review_organisation(t.id('org_a'), 'verified', 'self')$$,
  'a member cannot verify their own organisation', '%Only KYP staff%');
select t.fails($$select public.record_accreditation(t.id('org_a'), 'ISO/IEC 17025', 'Body', array['lab_result'])$$,
  'a member cannot record an accreditation', '%Only KYP staff%');
select t.fails($$insert into public.kyp_admins (user_id) values ('a0000000-0000-4000-8000-00000000000a')$$,
  'a member cannot make themselves admin', '%permission denied%');

-- KYP staff verify four of the five.
select t.as_user('c0000000-0000-4000-8000-00000000000c');
select public.review_organisation(t.id(k), 'verified', 'Checked trade register entry.')
from unnest(array['org_a', 'org_b', 'org_l', 'org_i']) k;
select t.fails($$select public.review_organisation(t.id('org_p'), 'verified', '  ')$$,
  'a review needs a note', '%what was checked%');
insert into t.ids select 'accr_l', public.record_accreditation(
  t.id('org_l'), 'ISO/IEC 17025', 'Accreditation Body X', array['lab_result'],
  'STS 0000', 'Cannabinoids, terpenes, contaminants', current_date - 365, current_date + 365, null);
select t.ok((select count(*) = 4 from public.organisation_reviews), 'each review is recorded');

-- Anna builds her lots.
select t.as_user('a0000000-0000-4000-8000-00000000000a');
select t.fails($$select public.add_organisation_identifier(t.id('org_a'), 'lei', '5299000000000000000X')$$,
  'identifiers are frozen after verification', '%after verification%');
insert into t.ids select 'product_a', public.add_product(t.id('org_a'), 'Flower A', 'cannabis_flower', '07640000000001', null);
insert into t.ids select 'lot_a1', public.create_lot(t.id('product_a'), 'A-1', '2026-06-01', '2027-06-01', 'CH');
insert into t.ids select 'lot_a2', public.create_lot(t.id('product_a'), 'A-2');
insert into t.ids select 'lot_a3', public.create_lot(t.id('product_a'), 'A-3');
select t.fails($$select public.create_lot(t.id('product_a'), 'A-1')$$,
  'a lot number is unique per organisation', '%already exists%');

insert into t.ids select 'event_a1', public.record_event(t.id('lot_a1'), 'harvest', '2026-05-20', 'Thun', 'CH');

-- Requests go to verified organisations only.
select t.fails($$select public.request_attestation(t.id('lot_a1'), t.id('org_p'), 'lab_result')$$,
  'a request cannot go to an unverified organisation', '%verified%');
select t.fails($$select public.request_attestation(t.id('lot_a1'), t.id('org_a'), 'lab_result')$$,
  'an organisation cannot request from itself', '%Ask another%');
insert into t.ids select 'req_a1_lab', public.request_attestation(t.id('lot_a1'), t.id('org_l'), 'lab_result', 'Full panel please');
insert into t.ids select 'req_a1_gmp', public.request_attestation(t.id('lot_a1'), t.id('org_i'), 'gmp_release');
insert into t.ids select 'req_a2_lab', public.request_attestation(t.id('lot_a2'), t.id('org_l'), 'lab_result');
select t.fails($$select public.request_attestation(t.id('lot_a1'), t.id('org_l'), 'lab_result')$$,
  'no duplicate open request', '%already exists%');

-- Self-declared statement.
insert into t.ids select 'att_a1_origin', public.issue_attestation(
  t.id('org_a'), t.id('lot_a1'), 'origin', 'Grown indoors at our Thun site.');
select t.fails($$select public.issue_attestation(t.id('org_a'), t.id('lot_a2'), 'lab_result', 'x', '{"items":[]}')$$,
  'a lab result needs a test date', '%test date%');
select t.fails($$select public.issue_attestation(t.id('org_a'), t.id('lot_a2'), 'lab_result', 'x',
    '{"test_date":"2026-05-01","items":[{"kind":"contaminant","name":"Pesticides","value":3,"unit":"%"}]}')$$,
  'a contaminant check needs pass/fail', '%pass or fail%');

-- Lena's lab answers.
select t.as_user('1e000000-0000-4000-8000-00000000001e');
insert into t.ids select 'att_a1_lab', public.issue_attestation(
  t.id('org_l'), t.id('lot_a1'), 'lab_result', 'Full panel, within specification.',
  '{"test_date":"2026-05-28","items":[
     {"kind":"cannabinoid","name":"THC","value":21.4,"unit":"%"},
     {"kind":"terpene","name":"Myrcene","value":0.8,"unit":"%"},
     {"kind":"contaminant","name":"Heavy metals","passed":true}]}',
  'https://example.com/coa/A-1.pdf', repeat('a', 64), null, t.id('req_a1_lab'));
select t.ok((select status = 'fulfilled' from public.attestation_requests where id = t.id('req_a1_lab')),
  'issuing fulfils the request');
select t.fails($$select public.issue_attestation(t.id('org_l'), t.id('lot_a1'), 'lab_result', 'again',
    '{"test_date":"2026-05-28","items":[{"kind":"contaminant","name":"x","passed":true}]}', null, null, null, t.id('req_a1_lab'))$$,
  'a fulfilled request cannot be answered twice', '%already closed%');
select t.fails($$select public.issue_attestation(t.id('org_l'), t.id('lot_a2'), 'origin', 'x', '{}', null, null, null, t.id('req_a2_lab'))$$,
  'the answer must be of the requested kind', '%asks for a lab_result%');
select public.issue_attestation(
  t.id('org_l'), t.id('lot_a2'), 'lab_result', 'THC only.',
  '{"test_date":"2026-05-29","items":[{"kind":"cannabinoid","name":"THC","value":18,"unit":"%"}]}',
  null, null, null, t.id('req_a2_lab'));

-- Ivo's importer answers the GMP request (verified, no accreditation).
select t.as_user('10000000-0000-4000-8000-000000000010');
insert into t.ids select 'att_a1_gmp', public.issue_attestation(
  t.id('org_i'), t.id('lot_a1'), 'gmp_release', 'Released for the German market by our QP.',
  '{}', null, null, null, t.id('req_a1_gmp'));

-- Track-and-trace import (server-side, service key).
select t.as_service();
insert into t.ids select 'event_a1_import', public.import_event(
  t.id('lot_a1'), 'Track-and-trace (test)', 'tt-0001', 'packaging', '2026-06-01', 'Thun', 'CH');
select t.ok(public.import_event(t.id('lot_a1'), 'Track-and-trace (test)', 'tt-0001', 'packaging', '2026-06-01', 'Thun', 'CH') is null,
  'importing the same external event twice is a no-op');

-- Publish A-1 and A-3; recall A-3.
select t.as_user('a0000000-0000-4000-8000-00000000000a');
select public.publish_lot(t.id('lot_a1'));
select t.fails($$select public.publish_lot(t.id('lot_a3'))$$,
  'a lot without any statement cannot be published', '%at least one statement%');
select public.issue_attestation(t.id('org_a'), t.id('lot_a3'), 'other', 'Packed under nitrogen.');
select public.publish_lot(t.id('lot_a3'));
select public.recall_lot(t.id('lot_a3'), 'Recalled: test note.');

-- Boris's draft.
select t.as_user('b0000000-0000-4000-8000-00000000000b');
insert into t.ids select 'product_b', public.add_product(t.id('org_b'), 'Flower B', 'cannabis_flower');
insert into t.ids select 'lot_b1', public.create_lot(t.id('product_b'), 'B-1');
insert into t.ids select 'event_b1', public.record_event(t.id('lot_b1'), 'harvest', '2026-05-02', 'Kassel', 'DE');

-- Paul cannot publish while pending.
select t.as_user('90000000-0000-4000-8000-000000000090');
insert into t.ids select 'product_p', public.add_product(t.id('org_p'), 'Flower P', 'cannabis_flower');
insert into t.ids select 'lot_p1', public.create_lot(t.id('product_p'), 'P-1');
select public.issue_attestation(t.id('org_p'), t.id('lot_p1'), 'origin', 'Our farm.');
select t.fails($$select public.publish_lot(t.id('lot_p1'))$$,
  'an unverified organisation cannot publish', '%verified by KYP%');

reset role;
select t.ok((select count(*) = 5 and count(distinct public_code) = 5
                    and bool_and(public_code ~ '^[0-9a-hjkmnp-tv-z]{20}$') from public.lots),
  'public codes are unique, 20 base32 characters');
