# KYP concept

Status: version one, November 2026. This note records what has been decided and what is still open.

## What KYP is

KYP ("Know Your Product") is a product of Cannavigia / Vigia AG, a cannabis track-and-trace software company. A patient scans a code on a pack and lands on a public passport page for that exact batch.

KYP is being rebuilt from scratch. The only earlier work was a marketing landing page; none of it is reused.

## Decisions

**Who it is for.** Consumers and patients. No login, no app, phone first.

**First audience.** Patients in a medical market (Germany, Switzerland). Medical cannabis there falls under advertising rules for prescription medicines, so a passport is strictly factual: contents, laboratory results, origin, journey, authenticity, recall status. No effect claims, no dosing advice, no promotional language. The back office reminds producers of this where they type free text.

**Where the value lies.** The data is verified, not self-declared marketing. Long term, batches come from Cannavigia's track-and-trace platform. There is no access to that platform now, so:

- KYP keeps its own tables, shaped so batches can be imported later. Each batch has a `source` (`manual` or `cannavigia`) and an `external_ref`.
- A small back office lets a producer enter and publish a batch by hand.
- Until the import exists, the passport states plainly that the data was entered by the producer. The banner confirms the code and the publication, not the measurements.

**Out of version one, not designed out.** Consumer accounts, favourites, ratings and outcome reporting. Nothing in the schema blocks them: they would be new tables referencing batches or products.

**Technical setup.** Same as The Village (v3): Vite + React + TypeScript single-page app, React Router, Supabase, Vercel. Row level security on every table; every state change is a Postgres function called via RPC.

**Choices made while building**

- The public cannot read tables at all. The passport comes from one function that takes the code. A read policy on "published" would have let anyone list all codes.
- Passport codes are 20 random characters (100 bits), generated in the database.
- Batch lifecycle: draft → published → recalled. Publishing requires a laboratory result and freezes the results, so what a patient saw does not change later. A recall requires a note for patients and cannot be undone.
- The scan log stores the batch and the time. No IP address, device or location.
- Sign-in is email and password.
- One producer per account for now.

## Open questions

1. **First market.** Germany or Switzerland first? This decides the language, the legal review, and which contaminant checks and units the passport should expect.
2. **Pricing model.** Who pays: the producer per batch, per product, a flat fee, or is KYP bundled with Cannavigia? Nothing in the build assumes an answer.
3. **Cannavigia import.** Which fields does track and trace hold per batch, how is a KYP producer matched to a Cannavigia customer, and is it a push from Cannavigia or a pull? Should imported batches publish automatically? What does "verified" mean on the page once the import exists, and what should hand-entered batches be called next to them?
4. **Patient outcome reporting (phase two).** Patients reporting how a batch worked for them means health data, accounts and consent. Is this a KYP feature or a separate study tool, and who may see the results?
5. **Who can publish a recall.** Today only the producer. Should Cannavigia or an authority be able to mark a batch as recalled?
6. **Corrections after publishing.** A published result is frozen. If a certificate was entered wrongly, the only route is a recall. Is a visible "corrected on" mechanism needed?
7. **Pharmacies.** Should the dispensing pharmacy appear in the journey, and who enters it?
