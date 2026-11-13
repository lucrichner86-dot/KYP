# KYP — Know Your Product

A product passport for patients: scan the code on a pack and land on a public page for that exact batch. It shows what the laboratory measured, where the product was grown, the steps it went through, and whether the batch has been recalled. No login, no app, phone first.

Producers enter and publish batches in a small back office. KYP is a product of Cannavigia (Vigia AG). The thinking behind it is in [docs/concept.md](docs/concept.md).

## Run it

```bash
npm install
cp .env.example .env   # then fill in the publishable key
npm run dev
```

`.env` needs the Supabase project URL and publishable key (Supabase dashboard → Project settings → API). It is never committed. Without it the landing page still loads; the passport and the back office say they are not connected.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks and builds to `dist/` |
| `npm run preview` | Serves the built app locally |
| `npm run test:db` | Applies the migrations to a throwaway local Postgres and runs the flow checks |

## Set up the database

The Supabase project is "KYP" (`szabdtxeuzonojzxnhhc`, eu-west-1). **Nothing has been applied to it yet.**

1. Apply the files in `supabase/migrations` in order (SQL editor, or `supabase db push` with the CLI linked to the project).
2. Optional, for the demo passports linked from the landing page: run `supabase/seed.sql` once.
3. Authentication → URL configuration: set the site URL to the deployed address, so confirmation emails link back to it.
4. Put the project URL and publishable key in `.env` locally and in the Vercel project's environment variables. Set `VITE_PUBLIC_SITE_URL` to the production address so QR codes always point there.

`npm run test:db` needs a local Postgres install (`initdb`, `pg_ctl`, `psql`). It starts its own temporary cluster and never touches the Supabase project. `supabase/tests/setup/supabase_stub.sql` stands in for the Supabase roles and `auth.uid()` there; do not apply it to the real project.

How access works:

- The public has no access to any table. A passport is read through the function `get_passport(code)`, which returns one published or recalled batch for a code the caller already has. Drafts and unknown codes both return nothing.
- Signed-in members can read their own producer's rows and nothing else.
- Nobody writes to tables directly. Every change is a database function called via RPC: `create_producer`, `add_product`, `create_batch`, `add_lab_result`, `remove_lab_result`, `add_journey_step`, `remove_journey_step`, `publish_batch`, `recall_batch`.
- A batch goes draft → published → recalled. Publishing needs at least one laboratory result and freezes the results. Journey steps can still be added to a published batch. A recall needs a note and is final.

## What's in here

| Path | What it is |
| --- | --- |
| `src/pages/Landing.tsx` | `/` — what KYP is, link to the demo passport |
| `src/pages/Passport.tsx` | `/p/:code` — the public passport, and the "not recognised" page |
| `src/pages/office/` | `/office` — producer back office: sign-in, producer setup, overview, new batch, batch page with QR code |
| `src/lib/passport.ts` | The public passport read (plain `fetch`, so the passport page does not load the Supabase client) |
| `src/lib/supabase.ts`, `session.tsx` | Supabase client and session context (back office only) |
| `src/lib/data.ts` | Back office data loaders and one wrapper per database function |
| `src/lib/types.ts`, `format.ts` | Row types; dates, countries, labels |
| `supabase/migrations/` | Schema, row level security, functions |
| `supabase/seed.sql` | Demo producer, two products, three batches (one recalled, one draft) |
| `supabase/tests/` | SQL flow checks and `run-db-tests.sh` |
| `docs/concept.md` | Decisions so far and open questions |
| `vercel.json`, `public/_redirects` | Single-page routing on Vercel |

## Not done yet

- **Migrations are not applied** to the Supabase project, and the app has not been run against it. The database functions are tested on local Postgres; the screens were checked in a browser against stubbed API responses. The first real sign-in, batch entry and scan are still to be done.
- **Logo.** The KYP logo from 2023 is not in the repository; the header shows a text wordmark.
- **German.** The interface is English only. The first audience is in Germany and Switzerland.
- **Certificate upload.** A laboratory result links to a certificate by URL; there is no file upload.
- **"Verified" is limited.** Today a passport confirms that the code belongs to a batch the producer published. The data itself is typed in by the producer, and the page says so. Verification by source comes with the Cannavigia import (`batches.source`, `batches.external_ref` are ready for it).
- **Editing.** A draft's laboratory results and journey steps can be removed and re-entered, but its batch number, dates and origin cannot be edited, and products cannot be edited or deleted.
- **Team members.** One account per producer; no invitations.
- **Password reset** screen.
- **Legal pages** (imprint, privacy notice) and a review of the passport wording against German and Swiss advertising rules for medicines.
- Patient accounts, favourites, ratings and outcome reporting are a later phase by decision.
