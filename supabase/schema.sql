-- ════════════════════════════════════════════════════════════════════════
--  CVeed — Database schema  (paste-and-run in the Supabase SQL Editor)
--
--  HOW TO USE:
--    Supabase Dashboard → SQL Editor → New query → paste ALL of this → Run.
--  Safe to run more than once (uses IF NOT EXISTS / CREATE OR REPLACE).
-- ════════════════════════════════════════════════════════════════════════

-- pgvector powers semantic search at scale (docs/08). Optional for the demo.
create extension if not exists vector;

-- ── ENUMS ───────────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('candidate','employer','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type open_to_opportunities as enum
    ('not_looking','slightly_open','open_to_discussions','actively_exploring','available_immediately');
exception when duplicate_object then null; end $$;

do $$ begin
  create type noc_status as enum ('yes','no','unknown');
exception when duplicate_object then null; end $$;

-- ── PROFILES (one row per auth user) ────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'candidate',
  full_name   text,
  email       text,
  phone       text,
  whatsapp    text,
  location    text,
  created_at  timestamptz not null default now()
);

-- ── CANDIDATES (the living career profile) ──────────────────────────────
create table if not exists public.candidates (
  id                    uuid primary key references public.profiles(id) on delete cascade,
  current_title         text,
  years_experience      numeric default 0,
  summary               text,
  skills                text[] default '{}',
  certifications        text[] default '{}',
  languages             text[] default '{}',
  industries            text[] default '{}',
  previous_companies    text[] default '{}',
  work_history          jsonb default '[]',
  education             jsonb default '[]',
  expected_salary_min   numeric,
  expected_salary_max   numeric,
  currency              text default 'QAR',
  notice_period         text,
  availability          text,
  noc_status            noc_status default 'unknown',
  preferred_job_type    text,
  preferred_roles       text[] default '{}',
  preferred_industries  text[] default '{}',
  preferred_locations   text[] default '{}',
  open_to_opportunities open_to_opportunities not null default 'open_to_discussions',
  cv_url                text,
  cv_text               text,
  video_url             text,
  completeness          int default 0,
  embedding             vector(1536),
  updated_at            timestamptz not null default now()
);

-- ── EMPLOYERS (company profile) ─────────────────────────────────────────
create table if not exists public.employers (
  id             uuid primary key references public.profiles(id) on delete cascade,
  company_name   text,
  industry       text,
  company_size   text,
  contact_person text,
  phone          text,
  location       text,
  created_at     timestamptz not null default now()
);

-- ── HIRING REQUESTS ─────────────────────────────────────────────────────
create table if not exists public.hiring_requests (
  id                  uuid primary key default gen_random_uuid(),
  employer_id         uuid not null references public.profiles(id) on delete cascade,
  title               text not null,
  role_category       text default 'general',
  description_raw     text,
  required_skills     text[] default '{}',
  nice_to_have_skills text[] default '{}',
  min_years_experience numeric default 0,
  industries          text[] default '{}',
  languages           text[] default '{}',
  certifications      text[] default '{}',
  location            text,
  salary_min          numeric,
  salary_max          numeric,
  currency            text default 'QAR',
  noc_required        boolean default false,
  job_type            text default 'full_time',
  start_date          text,
  embedding           vector(1536),
  status              text default 'open',
  created_at          timestamptz not null default now()
);

-- ── MATCHES (ranked screening results) ──────────────────────────────────
create table if not exists public.matches (
  id                uuid primary key default gen_random_uuid(),
  hiring_request_id uuid not null references public.hiring_requests(id) on delete cascade,
  candidate_id      uuid not null references public.candidates(id) on delete cascade,
  score             numeric not null,
  breakdown         jsonb default '{}',
  summary           text,
  strengths         text[] default '{}',
  gaps              text[] default '{}',
  risks             text[] default '{}',
  shortlisted       boolean default false,
  created_at        timestamptz not null default now(),
  unique (hiring_request_id, candidate_id)
);

create index if not exists idx_matches_request on public.matches(hiring_request_id);
create index if not exists idx_candidates_open on public.candidates(open_to_opportunities);

-- ════════════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY  (see docs/04-rls-policies.md for the full rationale)
-- ════════════════════════════════════════════════════════════════════════
alter table public.profiles        enable row level security;
alter table public.candidates      enable row level security;
alter table public.employers       enable row level security;
alter table public.hiring_requests enable row level security;
alter table public.matches         enable row level security;

-- helper: is the current user an admin?
create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- helper: is the current user an employer?
create or replace function public.is_employer() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'employer');
$$;

-- PROFILES: you manage your own row; admins see all.
drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for all using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id);

-- CANDIDATES: owner manages own; employers can READ candidates who are open;
-- admins see all.
drop policy if exists candidates_owner on public.candidates;
create policy candidates_owner on public.candidates
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists candidates_employer_read on public.candidates;
create policy candidates_employer_read on public.candidates
  for select using (
    public.is_admin()
    or (public.is_employer() and open_to_opportunities <> 'not_looking')
  );

-- EMPLOYERS: owner manages own; admins see all.
drop policy if exists employers_owner on public.employers;
create policy employers_owner on public.employers
  for all using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id);

-- HIRING REQUESTS: owner manages own; admins see all.
drop policy if exists hr_owner on public.hiring_requests;
create policy hr_owner on public.hiring_requests
  for all using (auth.uid() = employer_id or public.is_admin())
  with check (auth.uid() = employer_id);

-- MATCHES: the owning employer reads matches for their requests; the candidate
-- can read matches about themselves; admins see all. (Writes happen server-side
-- with the service_role key, which bypasses RLS.)
drop policy if exists matches_read on public.matches;
create policy matches_read on public.matches
  for select using (
    public.is_admin()
    or candidate_id = auth.uid()
    or exists (
      select 1 from public.hiring_requests hr
      where hr.id = matches.hiring_request_id and hr.employer_id = auth.uid()
    )
  );

-- ════════════════════════════════════════════════════════════════════════
--  AUTO-CREATE a profile row when a new auth user signs up.
-- ════════════════════════════════════════════════════════════════════════
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'candidate')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ════════════════════════════════════════════════════════════════════════
--  STORAGE bucket for CVs and videos (private; owner-only access).
-- ════════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do nothing;

drop policy if exists cv_owner_rw on storage.objects;
create policy cv_owner_rw on storage.objects
  for all to authenticated
  using (bucket_id = 'cvs' and owner = auth.uid())
  with check (bucket_id = 'cvs' and owner = auth.uid());
