# Archive

Work that has been set aside. Nothing here is live, and nothing here is the plan. Kept for reference only.

| Folder | What it is | Why it was archived |
| --- | --- | --- |
| `2026-11-v1-batch-passport/` | First build of KYP (November 2026): a patient-facing batch passport for medical cannabis, a producer back office with hand-entered batches, Supabase schema with row level security, SQL flow checks. Its own README and `docs/concept.md` describe it in full. | The direction changed before it was deployed. KYP is being rethought as "KYC for products": a verifiable provenance layer for highly regulated goods, aligned with the EU Digital Product Passport, fed by real track-and-trace data instead of hand entry. |

## State of the archived build

- Never deployed. Its migrations were never applied to the Supabase project "KYP" (`szabdtxeuzonojzxnhhc`), which is still empty.
- It built and its database checks passed on local Postgres when archived. To run it, work inside its folder (`npm install`, `npm run build`, `npm run test:db`).

## Earlier work that is not in this repository

- A marketing landing page made in Lovable (sections: Hero, Supply Chain, Product Cards, Features, Transparency). The code was never available here.
- A KYP logo from 2023. Not in the repository.

## What may be worth reusing

- The access model: the public reads one record through a function that takes an unguessable code; no table is publicly listable.
- The lifecycle rule that a published record is frozen and a recall is final and visible at once.
- The `source` / `external_ref` fields on batches, meant for import from Cannavigia track and trace.
- The local database test runner.
