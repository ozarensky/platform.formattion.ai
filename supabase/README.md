# Supabase set-up for operatives

What the intake form needs on the Supabase side, in the order to build it. All of it
goes in the existing **platform.formattion** project (the one `assets/config.js`
already points at: `uhomumiwlbrvsdefodjs`). No second project.

## How it fits together

```
Platform.dc.html (manager, logged in)       join.html?t=<token> (operative, no account)
        │                                           │
        │ "Send the link"                           │ opens the link from the text
        ▼                                           ▼
  Edge Function create-invite              Edge Functions get-invite · save-draft
        │                                           · upload-url · submit-intake
        │ service-role key (bypasses RLS)           │ service-role key, after checking the token
        ▼                                           ▼
  ┌──────────────────────── Postgres ──────────────────────────┐
  │ tenants · memberships · operatives · operative_cards       │
  │ operative_bank · operative_invites        (RLS by tenant)  │
  └────────────────────────────────────────────────────────────┘
  ┌──────────────────────── Storage ───────────────────────────┐
  │ bucket "operatives" (private)                               │
  │   {tenant_id}/{operative_id}/photo.jpg, signature.png,      │
  │   licence/front.jpg, right-to-work/document.jpg,            │
  │   cards/{card_id}/front.jpg, back.jpg                       │
  └────────────────────────────────────────────────────────────┘
```

The "folder per operative" is the `{tenant_id}/{operative_id}/` prefix in the bucket.
Supabase Storage shows prefixes as folders in the dashboard.

The platform reads the Waiting list, the approve screen and the photos straight
through supabase-js as the logged-in manager (row-level security limits it to their
own tenant). Only the two things that need to happen without a log-in or with
secrets go through Edge Functions: creating the link (it needs the Twilio keys) and
everything the form does.

## Step 1 — Run the database migration (2 minutes)

1. Open the project → **SQL Editor** → **New query**.
2. Paste `supabase/migrations/0001_operatives.sql` and press **Run**.
3. Check **Table Editor**: you should see `tenants`, `memberships`, `operatives`,
   `operative_cards`, `operative_bank`, `operative_invites`.
4. Check **Storage**: a private bucket called `operatives`.

| Table | Holds | Who can read it from the browser |
|---|---|---|
| `tenants` | one row per subcontractor company | its members |
| `memberships` | which log-in belongs to which tenant | the user, their own rows |
| `operatives` | one row per person, status `invited → draft → to_approve → active` | tenant members |
| `operative_cards` | one row per card, with `expires_on` (what For watches) | tenant members |
| `operative_bank` | sort code / account, kept apart | tenant members |
| `operative_invites` | the link tokens, hashed, 7-day expiry, `used_at` on submit | tenant members (read only) |

## Step 2 — Give yourself a tenant (1 minute)

The migration adds a trigger: every new sign-up gets a tenant of their own and an
`owner` membership. Your existing log-in predates it, so do it once by hand:

```sql
-- SQL Editor. Finds your user from the email you log in with.
with me as (select id from auth.users where email = '<your-email>'),
     t  as (insert into public.tenants (name) values ('Woodleaze') returning id)
insert into public.memberships (user_id, tenant_id, role)
select me.id, t.id, 'owner' from me, t;
```

Roles: `owner` and `manager` are the client's own people; `formattion` is formattion.ai
staff working inside the client's account to build and support it. Policies only check
membership, not role, so all three see the same thing. Check with:

```sql
select t.name, u.email, m.role from public.memberships m
join public.tenants t on t.id = m.tenant_id join auth.users u on u.id = m.user_id;
```

The form's welcome screen and the text say "Ion at Woodleaze has added you". The name
comes from the inviter's log-in; set it once:

```sql
update auth.users
set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"first_name": "Ion"}'
where email = '<your-email>';
```

Without it, the part of the email before the @ is used.

## Step 3 — Deploy the Edge Functions (5 minutes)

Five small functions, all in `supabase/functions/`:

| Function | Called by | Does |
|---|---|---|
| `create-invite` | Platform, "Send the link" | reads the manager's tenant, inserts `operatives` (status `invited`) + `operative_invites`, texts the link (or hands it back to copy/share) |
| `get-invite` | Form, on open | checks the token: not expired, not used → returns first name, company, start date, saved draft and signed links to any photos already uploaded |
| `save-draft` | Form, every step | stores the current answers in `operatives.draft` (the "come back to it" rule) |
| `upload-url` | Form, every photo | returns a one-off signed upload URL for exactly one path under the operative's folder; the phone uploads straight to Storage |
| `submit-intake` | Form, "Send to David" | checks the token again, writes the columns, cards and bank row, records the signature, sets `used_at` (link closes) and status `to_approve` |

Install the CLI once, then from the repo root:

```sh
npm i -g supabase
supabase login                                   # opens the browser
supabase link --project-ref uhomumiwlbrvsdefodjs
supabase functions deploy                        # deploys all five; config.toml turns off JWT checks for them
```

Then the secrets (**Project Settings → Edge Functions → Secrets**, or the CLI):

```sh
supabase secrets set INTAKE_BASE_URL=https://platform.formattion.ai/join.html
# Twilio, from console.twilio.com → Account info. Leave these out and "Send the link"
# shows the link to copy or share instead of texting it.
supabase secrets set TWILIO_ACCOUNT_SID=AC...  TWILIO_AUTH_TOKEN=...  TWILIO_FROM=+447460077297
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set automatically. Never put the
service-role key in `assets/config.js` or anywhere in the repo.

A **trial** Twilio account only texts numbers you have verified in its console
(Phone Numbers → Verified Caller IDs) and prefixes every message with "Sent from
your Twilio trial account". Upgrade when real operatives start getting links.

## Step 4 — Try it end to end

1. Log in to the platform → menu → operatives → **Invite an operative**. First name,
   mobile, Send the link.
2. The next screen shows the link (and says whether it was texted). Open it on a phone:
   `https://platform.formattion.ai/join.html?t=…`
3. Fill the form, sign, **Send to David**. Each photo uploads as it is taken; the final
   step only sends text.
4. Back on the platform, operatives → **Waiting** shows them as *to approve*. Open,
   check the photos, **Approve and add**. They move up into the list.

If something fails: **Edge Functions → Logs** in the dashboard shows each call and
its error. The form shows a plain-English line above the Next button.

## What is still mock

- **Card names, numbers and expiry dates.** The design says "For reads the card";
  today a card is saved as "Card 1", "Card 2" with both photos, and the approve
  screen says the number and date are to check. Reading them from the photos is the
  next piece (an Edge Function with an image model).
- **The rest of the platform** (projects, money, equipment, the operative profile
  page) is still the design's mock data. Approved operatives appear in the list
  but have no profile page yet.
- **"For nudges after 2 days"** is a scheduled query on `operative_invites` where
  `opened_at is null and created_at < now() - interval '2 days'`; not written yet.

## Keeping it lawful

The form collects NI numbers, bank details, right-to-work documents and a signature —
all personal data under UK GDPR, and right-to-work copies carry a statutory retention
(two years after the person leaves). Before going live:

- add a consent line on **Check and sign** ("Woodleaze will keep this to pay you and
  prove your right to work; see our privacy notice");
- set a retention: a scheduled query that deletes bank rows and right-to-work files a
  fixed time after `status = 'left'`;
- consider encrypting `operative_bank` columns with Supabase Vault, or storing only
  the last four digits of the account and keeping the full details in payroll.
