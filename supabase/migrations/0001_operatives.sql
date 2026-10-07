-- Operatives: tenants, memberships, operatives, cards, bank details, invite links
-- and the private "operatives" storage bucket.
--
-- Paste the whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run once on a fresh project. Every table has row-level security on;
-- a logged-in manager only ever sees rows and files under their own tenant.
-- The intake form itself never touches these tables: Edge Functions do, with the
-- service-role key, after checking the invite token.

-- ---------------------------------------------------------------------------
-- 1. Tenants and who belongs to them
-- ---------------------------------------------------------------------------

create table public.tenants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                      -- "Harlow Groundworks Ltd"
  created_at  timestamptz not null default now()
);

create table public.memberships (
  user_id     uuid not null references auth.users (id) on delete cascade,
  tenant_id   uuid not null references public.tenants (id) on delete cascade,
  role        text not null default 'manager' check (role in ('owner', 'manager')),
  created_at  timestamptz not null default now(),
  primary key (user_id, tenant_id)
);

-- Which tenants does the logged-in user belong to? Used by every policy below.
-- security definer so the policy can read memberships without needing a
-- policy on memberships that refers back to itself.
create or replace function public.my_tenant_ids()
returns setof uuid
language sql stable security definer
set search_path = public
as $$
  select tenant_id from public.memberships where user_id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- 2. Operatives: one row per person, from invite to active
-- ---------------------------------------------------------------------------

create table public.operatives (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants (id) on delete cascade,

  -- lifecycle: invited → draft (opened the link) → to_approve (submitted) → active / left
  status          text not null default 'invited'
                  check (status in ('invited', 'draft', 'to_approve', 'active', 'left')),

  -- from the invite screen
  first_name      text not null,
  mobile          text,                           -- E.164, "+447700900859"
  starts_on       date,
  invited_by      uuid references auth.users (id),

  -- About you
  surname         text,
  gender          text,                           -- Male / Female / Other / Prefer not to say
  date_of_birth   date,
  trade           text,
  address_line    text,
  town            text,
  county          text,
  postcode        text,

  -- Driving licence (all optional: "Next, no licence")
  licence_number  text,
  licence_expiry  date,
  licence_points  smallint check (licence_points between 0 and 99),
  licence_front_path text,                        -- storage paths, see bucket below
  licence_back_path  text,

  -- Right to work
  rtw_type        text check (rtw_type in ('passport', 'code', 'brp')),
  rtw_share_code  text,
  rtw_photo_path  text,

  -- Getting paid (bank details live in operative_bank)
  ni_number       text,

  -- Emergency contact
  emergency_name      text,
  emergency_phone     text,
  emergency_relation  text,

  -- Photo and signature
  photo_path      text,
  signature_path  text,
  signed_at       timestamptz,

  -- The form keeps answers between opens; save-draft writes the raw state here
  -- until submit, when it is split into the columns above.
  draft           jsonb,

  submitted_at    timestamptz,
  approved_at     timestamptz,
  approved_by     uuid references auth.users (id),

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index operatives_tenant_idx on public.operatives (tenant_id, status);

-- ---------------------------------------------------------------------------
-- 3. Cards: one row per card so For can watch each expiry date
-- ---------------------------------------------------------------------------

create table public.operative_cards (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references public.tenants (id) on delete cascade,
  operative_id  uuid not null references public.operatives (id) on delete cascade,
  name          text not null,                    -- "CSCS Green", "IPAF 3a/3b", "First aid at work"
  number        text,
  expires_on    date,
  front_path    text,
  back_path     text,
  created_at    timestamptz not null default now()
);

create index operative_cards_operative_idx on public.operative_cards (operative_id);
create index operative_cards_expiry_idx on public.operative_cards (tenant_id, expires_on);

-- ---------------------------------------------------------------------------
-- 4. Bank details: own table so access can be tightened separately
-- ---------------------------------------------------------------------------

create table public.operative_bank (
  operative_id  uuid primary key references public.operatives (id) on delete cascade,
  tenant_id     uuid not null references public.tenants (id) on delete cascade,
  account_name  text,
  sort_code     text,                             -- "12-34-56"
  account       text,                             -- 8 digits
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. Invite links: the token in the text message
-- ---------------------------------------------------------------------------

create table public.operative_invites (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references public.tenants (id) on delete cascade,
  operative_id  uuid not null references public.operatives (id) on delete cascade,
  token_hash    text not null unique,             -- sha256 of the token; the token itself is only in the SMS
  sent_to       text not null,                    -- mobile it went to
  expires_at    timestamptz not null default now() + interval '7 days',
  opened_at     timestamptz,                      -- first open
  used_at       timestamptz,                      -- set on submit; the link closes
  created_by    uuid references auth.users (id),
  created_at    timestamptz not null default now()
);

create index operative_invites_operative_idx on public.operative_invites (operative_id);

-- ---------------------------------------------------------------------------
-- 6. updated_at
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger operatives_touch before update on public.operatives
  for each row execute function public.touch_updated_at();
create trigger operative_bank_touch before update on public.operative_bank
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 7. Row-level security
-- ---------------------------------------------------------------------------

alter table public.tenants           enable row level security;
alter table public.memberships       enable row level security;
alter table public.operatives        enable row level security;
alter table public.operative_cards   enable row level security;
alter table public.operative_bank    enable row level security;
alter table public.operative_invites enable row level security;

-- Managers see their own tenant(s) and their own membership rows.
create policy "members read their tenants" on public.tenants
  for select to authenticated using (id in (select public.my_tenant_ids()));

create policy "users read their memberships" on public.memberships
  for select to authenticated using (user_id = auth.uid());

-- Operatives, cards, bank: full access inside your tenant from the platform.
create policy "tenant members manage operatives" on public.operatives
  for all to authenticated
  using (tenant_id in (select public.my_tenant_ids()))
  with check (tenant_id in (select public.my_tenant_ids()));

create policy "tenant members manage cards" on public.operative_cards
  for all to authenticated
  using (tenant_id in (select public.my_tenant_ids()))
  with check (tenant_id in (select public.my_tenant_ids()));

create policy "tenant members manage bank details" on public.operative_bank
  for all to authenticated
  using (tenant_id in (select public.my_tenant_ids()))
  with check (tenant_id in (select public.my_tenant_ids()));

-- Invites: managers can see when a link was opened; only Edge Functions
-- (service role, which bypasses RLS) create, check or close them.
create policy "tenant members read invites" on public.operative_invites
  for select to authenticated using (tenant_id in (select public.my_tenant_ids()));

-- ---------------------------------------------------------------------------
-- 8. Storage: one private bucket, a "folder" per operative
--    operatives/{tenant_id}/{operative_id}/photo.jpg
--    operatives/{tenant_id}/{operative_id}/signature.png
--    operatives/{tenant_id}/{operative_id}/licence/front.jpg, back.jpg
--    operatives/{tenant_id}/{operative_id}/right-to-work/passport.jpg
--    operatives/{tenant_id}/{operative_id}/cards/{card_id}/front.jpg, back.jpg
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('operatives', 'operatives', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

-- Managers read and tidy files under their own tenant folder. Uploads from the
-- intake form go through signed upload URLs minted by an Edge Function, so
-- the form never needs an insert policy of its own.
create policy "tenant members read operative files" on storage.objects
  for select to authenticated
  using (bucket_id = 'operatives' and (storage.foldername(name))[1] in (select public.my_tenant_ids()::text));

create policy "tenant members upload operative files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'operatives' and (storage.foldername(name))[1] in (select public.my_tenant_ids()::text));

create policy "tenant members delete operative files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'operatives' and (storage.foldername(name))[1] in (select public.my_tenant_ids()::text));

-- ---------------------------------------------------------------------------
-- 9. New sign-ups: give each new user a tenant of their own.
--    (Remove this trigger once tenants are created from an admin screen.)
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  t uuid;
begin
  insert into public.tenants (name)
  values (coalesce(new.raw_user_meta_data ->> 'company', split_part(coalesce(new.email, new.phone, 'New company'), '@', 1)))
  returning id into t;
  insert into public.memberships (user_id, tenant_id, role) values (new.id, t, 'owner');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
