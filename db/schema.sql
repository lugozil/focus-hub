-- Esquema del dashboard de landings (Postgres / Neon).
-- Se aplica con: node --env-file=.env.local scripts/db-setup.mjs

create table if not exists events (
  id          bigserial primary key,
  ts          timestamptz not null default now(),
  landing     text not null,
  session_id  text not null,
  type        text not null,
  name        text,
  detail      text,
  value       integer,
  device      text,
  source      text
);

create index if not exists events_ts_idx on events (ts);
create index if not exists events_session_idx on events (session_id, ts);
create index if not exists events_type_ts_idx on events (type, ts);

create table if not exists leads (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  landing     text not null,
  nombre      text not null,
  email       text not null,
  telefono    text not null,
  dealership  text,
  cargo       text,
  carros      text,
  servicios   text,
  agendado    boolean not null default false,
  cita        text,
  unique (landing, email, telefono)
);

create index if not exists leads_created_idx on leads (created_at);
