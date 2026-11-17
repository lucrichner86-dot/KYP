# KYP concept — version two

Status: November 2026. This replaces the first build's concept, which is kept in `archive/2026-11-v1-batch-passport/docs/concept.md`.

## The idea

Know Your Product does for goods what Know Your Customer does in finance: before you rely on a claim, you know who made it and whether they are who they say they are. The first use case is cannabis; other highly regulated goods follow.

## Decisions taken from the research

The research report (`reports/EU product passport KYP analysis.md`) found that the EU Digital Product Passport checks that data is present and well-formed, not that it is true, and that cannabis is outside it. That shaped this version:

1. **The product is the trust layer, not the passport page.** Every fact carries its issuer and an assurance level. A record with only owner declarations says so plainly.
2. **Know your business first.** Organisations are verified by KYP before they can publish or count as a third party. What was checked is recorded.
3. **Accreditation is recorded, not claimed.** A KYP admin records accreditations after checking them, and says which kinds of statement each one covers.
4. **Issuers own their statements.** The party that pays (the producer) cannot edit or hide a lab's or importer's statement. Revocations stay visible. This answers the research's warning about producer-pays verification.
5. **Facts, not quality.** No scores, rankings or effect claims. The levels describe who stands behind a fact, not how good the product is.
6. **Real data where possible.** Track-and-trace events are imported server-side and shown as such; typed-in events are shown as owner declarations.
7. **Compatible with the DPP stack later.** Event types follow EPCIS; products can carry GTINs; the record could be served behind a GS1 Digital Link resolver.

## Open questions

These are the report's open questions that this build does not answer:

1. **Who is compelled to use KYP?** Importers, Qualified Persons, pharmacy chains or a regulator — the first pilot should test which.
2. **Governance.** How KYP stays credibly neutral while linked to Cannavigia; who owns and audits the admin role.
3. **Liability** when a statement at "accredited" level turns out wrong.
4. **Signatures.** When to move from account attribution to signed credentials (W3C VC / eIDAS seals), and with which labs.
5. **Whether patients use it.** Measure real scans in one pilot before investing in the consumer side.
6. **Is the record page lawful in Germany** under the advertising ban for prescription medicines?
7. **Pricing**: who pays, and how that payment is kept apart from the verification decision.
8. **Name clearance** for "Know Your Product" / "KYP".
