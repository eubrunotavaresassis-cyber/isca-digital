-- Supabase / Postgres schema for PLAN INVEST

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  password text not null,
  created_at timestamptz default now()
);

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date,
  category text,
  description text,
  type text,
  value numeric,
  payment_method text,
  necessary boolean default false,
  notes text
);
