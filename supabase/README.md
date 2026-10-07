# Supabase set-up for operatives

What the intake form needs on the Supabase side, in the order to build it. All of it
goes in the existing **platform.formattion** project (the one `assets/config.js`
already points at: `uhomumiwlbrvsdefodjs`). No second project.

## How it fits together

```
Platform (manager, logged in)          Intake form (operative, no account)
        │                                        │
        │ "Send the link"                        │ opens platform.formattion.ai/join/<token>
        ▼                                        ▼
  Edge Function create-invite           Edge Functions get-invite · save-draft
        │                                        · upload-url · submit-intake
        │ service-role key (bypasses RLS)        │ service-role key, after checking the token
        ▼                                        ▼
  ┌──────────────────────── Postgres ──────────────────────────┐
  │ tenants · memberships · operatives · operative_cards       │
  │ operative_bank · operative_invites        (RLS by tenant)  │
  └────────────────────────────────────────────────────────────┘
  ┌──────────────────────── Storage ───────────────────────────┐
  │ bucket "operatives" (private)                               │
  │   {tenant_id}/{operative_id}/photo.jpg, signature.png,      │
  │   licence/…, right-to-work/…, cards/{card_id}/front.jpg …   │
  └────────────────────────────────────────────────────────────┘
```

The "folder per operative" you want is the `{tenant_id}/{operative_id}/` prefix in the
bucket. Supabase Storage shows prefixes as folders in the dashboard.

## Step 1 — Run the database migration

1. Open the project → **SQL Editor** → **New query**.
2. Paste `supabase/migrations/0001_operatives.sql` and press **Run**.
3. Check **Table Editor**: you should see `tenants`, `memberships`, `operatives`,
   `operative_cards`, `operative_bank`, `operative_invites`.
4. Check **Storage**: a private bucket called `operatives`.

What it did:

| Table | Holds | Who can read it from the browser |
|---|---|---|
| `tenants` | one row per subcontractor company | its members |
| `memberships` | which log-in belongs to which tenant | the user, their own rows |
| `operatives` | one row per person, status `invited → draft → to_approve → active` | tenant members |
| `operative_cards` | one row per card, with `expires_on` (what For watches) | tenant members |
| `operative_bank` | sort code / account, kept apart | tenant members |
| `operative_invites` | the link tokens, hashed, 7-day expiry, `used_at` on submit | tenant members (read only) |

Row-level security is on everywhere. A policy is a rule like "this row's `tenant_id`
must be one of the tenants the logged-in user belongs to". The intake form is not
logged in, so it cannot read or write anything directly; it goes through Edge
Functions (step 3).

## Step 2 — Give yourself a tenant

The migration adds a trigger: every new sign-up gets a tenant of their own and an
`owner` membership. Your existing log-in predates it, so do it once by hand:

```sql
-- SQL Editor
insert into public.tenants (name) values ('Harlow Groundworks Ltd') returning id;
-- copy the id, then (your user id is under Authentication → Users):
insert into public.memberships (user_id, tenant_id, role)
values ('<your-user-id>', '<tenant-id>', 'owner');
```

Test it: **SQL Editor** → run `select * from public.my_tenant_ids();` while
impersonating your user (the **Role** dropdown above the query → *authenticated* →
pick your user). You should see one id.

## Step 3 — Edge Functions

Five small functions, all in `supabase/functions/`. They run on Supabase's servers
with the **service-role** key, which is how they can write to tables the form itself
cannot touch.

| Function | Called by | Does |
|---|---|---|
| `create-invite` | Platform, "Send the link" | reads the manager's tenant, inserts `operatives` (status `invited`) + `operative_invites`, sends the SMS (or returns the link for share/copy) |
| `get-invite` | Form, on open | checks the token: not expired, not used → returns first name, company, start date, saved draft; marks `opened_at`, status `draft` |
| `save-draft` | Form, every step | stores the current answers in `operatives.draft` (the "come back to it" rule) |
| `upload-url` | Form, every photo | returns a one-off signed upload URL for exactly one path under the operative's folder; the phone uploads straight to Storage |
| `submit-intake` | Form, "Send to Dan" | checks the token again, writes the columns, cards and bank row, saves `signature.png`, sets `used_at` (link closes) and status `to_approve`, texts the manager |

Install the CLI once (`npm i -g supabase`), then:

```sh
supabase login
supabase link --project-ref uhomumiwlbrvsdefodjs
supabase functions deploy            # deploys everything under supabase/functions
```

Secrets the functions need (**Project Settings → Edge Functions → Secrets**, or
`supabase secrets set NAME=value`):

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — set automatically, nothing to do
- `INTAKE_BASE_URL` = `https://platform.formattion.ai/join`
- `SMS_PROVIDER` + its keys, once you pick one (see below)

Never put the service-role key in `assets/config.js` or anywhere in the repo.

## Step 4 — Sending the link

The functions always produce the same link: `https://platform.formattion.ai/join/<token>`.
How it reaches the operative is a setting:

1. **Share sheet / copy** (no account needed): `create-invite` returns the link and the
   platform opens the phone's share menu, or copies it. Start here.
2. **SMS**: add a Twilio (or Vonage / MessageBird) account, put the keys in Secrets, and
   `create-invite` sends "Dan at Harlow Groundworks has sent you a link to join the
   team: … It works until 14 Oct." Around 4–5p per text in the UK.
3. **WhatsApp Business API** via Twilio: same code path, but Meta approves the message
   template first.

The 7-day rule lives in `operative_invites.expires_at`; "closes on submit" is
`used_at`. For's nudge after 2 days is a scheduled query on invites where
`opened_at is null and created_at < now() - interval '2 days'`.

## Step 5 — Wiring the form

The uploaded form currently keeps everything in `localStorage` under `intake:demo`
and the final step only shows "Sent". The changes to make, in order:

1. Read the token from the URL and call `get-invite`; show "This link has closed" when
   it says so.
2. On every `goStep`, call `save-draft` as well as `localStorage.setItem`.
3. When a photo is taken (`readFile` → data URL), call `upload-url`, PUT the JPEG to it,
   and keep the returned **path** in state instead of the data URL.
4. On the last step, export the canvas (`sigRef.current.toDataURL('image/png')`),
   upload it the same way, then call `submit-intake` with the answers and paths.

## Keeping it lawful

The form collects NI numbers, bank details, right-to-work documents and a signature —
all personal data under UK GDPR, and right-to-work copies carry a statutory retention
(two years after the person leaves). Before going live:

- add a consent line on **Check and sign** ("Harlow Groundworks will keep this to pay
  you and prove your right to work; see our privacy notice");
- set a retention: a scheduled query that deletes bank rows and right-to-work files a
  fixed time after `status = 'left'`;
- consider encrypting `operative_bank` columns with Supabase Vault, or storing only the
  last four digits of the account and keeping the full details in your payroll system.
