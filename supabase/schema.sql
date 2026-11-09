-- Run this script in Supabase Dashboard -> SQL Editor.
-- It creates the shared student records table and protects it with RLS.

create table if not exists public.student_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default '',
  matric text not null unique,
  department text not null default '',
  faculty text not null default '',
  level text not null default '',
  phone text not null default '',
  bio text not null default '',
  portal_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists student_profiles_created_at_idx
  on public.student_profiles (created_at desc);

alter table public.student_profiles enable row level security;

create or replace function public.is_portal_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@northbridge.edu';
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  fallback_matric text := 'NBU/UG/' || to_char(current_date, 'YY') || '/' || upper(substr(replace(new.id::text, '-', ''), 1, 4));
begin
  insert into public.student_profiles (
    id,
    email,
    name,
    matric,
    department,
    faculty,
    level,
    phone,
    bio,
    portal_data
  )
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(metadata ->> 'name', ''),
    coalesce(nullif(metadata ->> 'matric', ''), fallback_matric),
    coalesce(metadata ->> 'department', ''),
    coalesce(metadata ->> 'faculty', ''),
    coalesce(metadata ->> 'level', ''),
    coalesce(metadata ->> 'phone', ''),
    coalesce(metadata ->> 'bio', ''),
    coalesce(metadata -> 'portalData', '{}'::jsonb)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop policy if exists "Students can view their own record" on public.student_profiles;
create policy "Students can view their own record"
  on public.student_profiles for select
  using (auth.uid() = id or public.is_portal_admin());

drop policy if exists "Students can update their own record" on public.student_profiles;
create policy "Students can update their own record"
  on public.student_profiles for update
  using (auth.uid() = id or public.is_portal_admin())
  with check (auth.uid() = id or public.is_portal_admin());

drop policy if exists "Students can create their own record" on public.student_profiles;
create policy "Students can create their own record"
  on public.student_profiles for insert
  with check (auth.uid() = id or public.is_portal_admin());

-- Keep the updated timestamp current whenever an admin or student edits a record.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists student_profiles_set_updated_at on public.student_profiles;
create trigger student_profiles_set_updated_at
  before update on public.student_profiles
  for each row execute procedure public.set_updated_at();

-- Admin setup:
-- In Supabase Dashboard -> Authentication -> Users, create a confirmed user:
-- Email: admin@northbridge.edu
-- Password: choose your private admin password
-- The normal portal login page will recognize that email as the admin account.
