# KYP — Know Your Product

Know Your Customer, for products. KYP is a verification layer for regulated goods, starting with cannabis. A code on the pack opens the public record of that exact lot, and every fact on it says **who stands behind it** and at what level:

| Level | Meaning |
| --- | --- |
| Accredited third party | Issued by a KYP-verified organisation holding a current accreditation that covers this kind of statement (e.g. an ISO/IEC 17025 lab for a lab result) |
| Independent third party | Issued by a KYP-verified organisation other than the owner, with no matching accreditation on file |
| Track-and-trace record | Imported from a track-and-trace system, not typed in |
| Declared by the owner | Stated by the organisation that owns the lot |
| Unverified party | Issued by an organisation KYP has not verified, or has suspended |

The reasoning behind this design is in `reports/EU product passport KYP analysis.md` and `docs/concept.md`.

## Live state

- **Database:** applied to the Supabase project "KYP" (`szabdtxeuzonojzxnhhc`, eu-west-1) on 17 November 2026, with the demo data from `supabase/seed.sql`.
- **Hosting:** prepared for Netlify (`netlify.toml`). Not deployed yet; see "Host it on Netlify".

## Run it

```bash
npm install
cp .env.example .env   # then fill in the publishable key
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks and builds to `dist/` |
| `npm run preview` | Serves the built app locally |
| `npm run test:db` | Applies the migrations to a throwaway local Postgres and runs the flow checks (89 checks) |

## Host it on Netlify

1. In Netlify: **Add new site → Import an existing project → GitHub**, pick `lucrichner86-dot/KYP` and the branch to deploy. Build settings come from `netlify.toml` (`npm run build`, publish `dist`).
2. **Site configuration → Environment variables**: add
   - `VITE_SUPABASE_URL` = `https://szabdtxeuzonojzxnhhc.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = the publishable key from Supabase → Project settings → API keys (it is meant to be public, but is kept out of the repository)
   - `VITE_PUBLIC_SITE_URL` = the final address (e.g. `https://knowyourproduct.com`), so QR codes point there
3. Deploy. Then in Supabase → **Authentication → URL configuration**, set the Site URL to the Netlify (or custom) address and add `<address>/app` to the redirect URLs, so confirmation emails link back correctly.
4. Optional: in Netlify → **Domain management**, add `knowyourproduct.com` and point its DNS to Netlify.

## Set up the database

Already done on the live project. For a new project: apply `supabase/migrations` in order, then optionally `supabase/seed.sql`.

**Make yourself a KYP admin.** Sign up in the app first, then run this once in the Supabase SQL editor with your own email:

```sql
insert into public.kyp_admins (user_id)
select id from auth.users where email = 'you@example.com';
```

Admins verify organisations and record accreditations at `/app/admin`. There is deliberately no way to become an admin from the app.

**Remove the demo data** with the statement at the bottom of `supabase/seed.sql`.

### How access works

- **The public** has no table access. A record is read through `get_record(code)`, which returns a published or recalled lot for a code the caller already has. Drafts and unknown codes both return nothing. Each view logs lot and time only.
- **Know your business first.** A new organisation is `pending`. It can prepare products and lots but cannot publish, and nobody can send it requests, until a KYP admin verifies it and records what was checked.
- **Statements belong to their issuer.** The lot owner can add its own statements (self-declared) and request statements from verified organisations. A requested statement is published under the issuer's name; the owner cannot edit or remove it. Only the issuer can revoke it, and the revocation stays visible on the record.
- **Levels are computed when the record is read**, so suspending an organisation or withdrawing an accreditation immediately lowers the level of its statements everywhere.
- **Track-and-trace import** goes through `import_event`, callable only with the service key (server-side), never from the browser.
- **Lifecycle:** draft → published (needs a verified owner and at least one active statement) → recalled (needs a public note; final). Recalled lots take no further events or statements.
- Every change is a Postgres function called via RPC; no client writes to tables.

## What's in here

| Path | What it is |
| --- | --- |
| `src/pages/Landing.tsx` | `/` — what KYP is, the five levels, demo links |
| `src/pages/Record.tsx` | `/r/:code` — the public record, and "code not recognised" |
| `src/pages/app/` | `/app` — workspace: sign-in, organisation registration and identifiers, products, lots, events, statements, requests in and out, publish, recall, QR code |
| `src/pages/admin/Admin.tsx` | `/app/admin` — KYP staff: verify or suspend organisations, record and withdraw accreditations |
| `src/pages/parts.tsx` | Shared pieces: level badges, lab result table, statement form (with in-browser SHA-256 fingerprint of the source document) |
| `src/lib/` | Supabase client, session, data loaders and RPC wrappers, public record fetch, types, labels |
| `supabase/migrations/` | Schema, row level security, functions |
| `supabase/seed.sql` | Demo: a producer, an accredited lab, an importer; one published lot, one recalled, one draft |
| `supabase/tests/` | SQL flow checks and `run-db-tests.sh` |
| `netlify.toml`, `public/_redirects` | Netlify build and single-page routing |
| `docs/concept.md` | What this version is and the open questions |
| `reports/`, `research_notes/` | The EU product passport research behind the design |
| `archive/` | The first build (patient batch passport), set aside |

## Not done yet

- **Not hosted.** Netlify needs the connect step above; nothing in this session could log in to Netlify.
- **The live API was not called over HTTP from here** (this environment cannot reach supabase.co). The live database was checked by running the public function as the anonymous role inside the database; the screens were checked in a browser against responses copied from that live data.
- **No track-and-trace connector.** `import_event` exists; nothing calls it yet. The Cannavigia integration is the next real piece.
- **Signatures.** Statements are attributed by account and organisation, and a document fingerprint can be stored. They are not yet cryptographically signed (W3C Verifiable Credentials / eIDAS seals, as in EN 18246).
- **Identifiers.** No GS1 Digital Link resolver; the QR code carries a KYP URL. GTINs can be stored on products.
- **Team members.** One account per organisation; no invitations.
- **Editing.** Lots and products cannot be edited after creation; statements can only be revoked and re-issued.
- **Notifications.** Requests and revocations are only visible in the app; no emails.
- **Legal review** of the public record wording (German advertising rules for prescription medicines), legal pages, German language, password reset, logo.
