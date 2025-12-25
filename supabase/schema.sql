create extension if not exists "pgcrypto";
create extension if not exists "unaccent";

do $$ begin
  create type content_status as enum ('draft','scheduled','published','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_type as enum ('post','page','project','event','residency','news','case_study');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_kind as enum ('image','video','document','audio','embed');
exception when duplicate_object then null; end $$;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'viewer',
  display_name text,
  created_at timestamptz not null default now()
);

create or replace function handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into profiles (id, role) values (new.id, 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

create or replace function is_editor() returns boolean
language sql stable as $$
  select exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.role in ('admin','editor')
  );
$$;

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null,
  kind media_kind not null,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  duration_seconds numeric(10,2),
  alt_text text,
  credit text,
  caption text,
  blurhash text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create unique index if not exists media_bucket_path on media (bucket, path);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  type content_type not null,
  slug text not null,
  title text not null,
  summary text,
  status content_status not null default 'draft',
  featured_media_id uuid references media(id),
  seo jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create unique index if not exists content_type_slug_unique
  on content_items (type, slug);

create index if not exists content_items_status_published_at_idx
  on content_items (status, published_at desc);

alter table content_items
  add column if not exists search tsvector
  generated always as (
    to_tsvector(
      'english',
      unaccent(coalesce(title,'')) || ' ' || unaccent(coalesce(summary,''))
    )
  ) stored;

create index if not exists content_items_search_idx
  on content_items using gin (search);

create table if not exists content_blocks (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references content_items(id) on delete cascade,
  position int not null,
  type text not null,
  data jsonb not null default '{}'::jsonb
);

create index if not exists content_blocks_content_position_idx
  on content_blocks (content_id, position);

create table if not exists content_sources (
  id text primary key,
  label text not null,
  description text,
  base_url text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_registry (
  id uuid primary key default gen_random_uuid(),
  source text not null references content_sources(id) on delete cascade,
  source_id text not null,
  type text not null,
  slug text,
  title text not null,
  summary text,
  image_url text,
  canonical_url text,
  tags text[],
  status content_status not null default 'published',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  raw jsonb not null default '{}'::jsonb
);

create unique index if not exists content_registry_source_unique
  on content_registry (source, source_id);

create index if not exists content_registry_status_published_at_idx
  on content_registry (status, published_at desc);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null
);

create table if not exists content_tags (
  content_id uuid references content_items(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (content_id, tag_id)
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists content_items_set_updated_at on content_items;
create trigger content_items_set_updated_at
before update on content_items
for each row execute procedure set_updated_at();

alter table content_items
  add constraint content_items_published_at_check
  check (status <> 'published' or published_at is not null);

drop trigger if exists content_sources_set_updated_at on content_sources;
create trigger content_sources_set_updated_at
before update on content_sources
for each row execute procedure set_updated_at();

drop trigger if exists content_registry_set_updated_at on content_registry;
create trigger content_registry_set_updated_at
before update on content_registry
for each row execute procedure set_updated_at();

alter table profiles enable row level security;
alter table media enable row level security;
alter table content_items enable row level security;
alter table content_blocks enable row level security;
alter table content_sources enable row level security;
alter table content_registry enable row level security;

create policy "Profiles self read"
  on profiles for select
  using (id = auth.uid());

create policy "Editors manage profiles"
  on profiles for all
  using (is_editor())
  with check (is_editor());

create policy "Public read published content"
  on content_items for select
  using (status = 'published');

create policy "Editors manage content"
  on content_items for all
  using (is_editor())
  with check (is_editor());

create policy "Public read blocks for published content"
  on content_blocks for select
  using (
    exists (
      select 1 from content_items ci
      where ci.id = content_id and ci.status = 'published'
    )
  );

create policy "Editors manage blocks"
  on content_blocks for all
  using (is_editor())
  with check (is_editor());

create policy "Public read media metadata"
  on media for select
  using (true);

create policy "Editors manage media"
  on media for all
  using (is_editor())
  with check (is_editor());

create policy "Public read published registry"
  on content_registry for select
  using (status = 'published');

create policy "Editors manage registry"
  on content_registry for all
  using (is_editor())
  with check (is_editor());

create policy "Editors manage sources"
  on content_sources for all
  using (is_editor())
  with check (is_editor());

create policy "Service role full access"
  on content_registry for all to service_role
  using (true)
  with check (true);

create policy "Service role full access"
  on content_sources for all to service_role
  using (true)
  with check (true);

create policy "Public read media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Editors upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and is_editor());

create policy "Editors update media"
  on storage.objects for update
  using (bucket_id = 'media' and is_editor())
  with check (bucket_id = 'media' and is_editor());

create policy "Editors delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and is_editor());
