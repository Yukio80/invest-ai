-- =============================================
-- Migration: Auth + Rate Limiting Infrastructure
-- =============================================

-- Tabela de perfis sincronizada com auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger: cria profile automaticamente no signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Tabela de uso (rate limiting)
create table if not exists public.usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  endpoint text not null,
  date date not null default current_date,
  count integer not null default 1,
  created_at timestamptz default now(),
  unique (user_id, endpoint, date)
);

-- Índice para consultas rápidas de cota
create index if not exists idx_usage_user_date on public.usage(user_id, date);

-- =============================================
-- Row Level Security
-- =============================================
alter table public.profiles enable row level security;
alter table public.usage enable row level security;

-- Profiles: cada um vê apenas o próprio
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Usage: cada um vê apenas o próprio uso
create policy "Users can view own usage"
  on public.usage for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.usage for insert
  with check (auth.uid() = user_id);

create policy "Users can update own usage"
  on public.usage for update
  using (auth.uid() = user_id);
