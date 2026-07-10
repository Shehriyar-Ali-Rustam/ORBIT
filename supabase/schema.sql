-- ============================================================
-- ORBIT Marketplace — full database schema
-- Run this in the Supabase SQL Editor on a fresh project to
-- recreate every table the freelancer marketplace needs.
-- Safe to re-run (uses IF NOT EXISTS everywhere).
--
-- IDs from Clerk (user IDs) are stored as text, e.g. "user_2ab...".
-- Table primary keys for gigs/orders/etc. are uuid.
-- All access goes through the server-side service-role key, so RLS is
-- enabled with no public policies (service role bypasses RLS).
-- ============================================================

-- ---------- profiles ----------
create table if not exists profiles (
  id                text primary key,          -- Clerk user ID
  email             text not null,
  display_name      text not null default 'User',
  photo_url         text,
  role              text not null default 'buyer' check (role in ('buyer','seller','both')),
  tagline           text,
  bio               text,
  skills            text[] not null default '{}',
  languages         jsonb  not null default '[]',
  hourly_rate       numeric,
  response_time     text,
  level             text not null default 'new' check (level in ('new','level-1','level-2','top-rated')),
  total_earnings    numeric not null default 0,
  completed_orders  int     not null default 0,
  rating            numeric not null default 0,
  review_count      int     not null default 0,
  portfolio_urls    text[] not null default '{}',
  github            text,
  linkedin          text,
  fiverr            text,
  available         boolean not null default true,
  country           text,
  stripe_customer_id text,
  stripe_connect_id  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------- gigs ----------
create table if not exists gigs (
  id            uuid primary key default gen_random_uuid(),
  seller_id     text not null references profiles(id) on delete cascade,
  title         text not null,
  slug          text not null,
  description   text not null default '',
  category      text not null default 'other' check (category in ('ai','web','mobile','design','marketing','other')),
  subcategory   text not null default '',
  tags          text[] not null default '{}',
  images        text[] not null default '{}',
  cover_image   text,
  pricing       jsonb not null default '{}',
  faq           jsonb not null default '[]',
  status        text not null default 'draft' check (status in ('draft','active','paused')),
  rating        numeric not null default 0,
  review_count  int     not null default 0,
  order_count   int     not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists gigs_seller_id_idx on gigs(seller_id);
create index if not exists gigs_slug_idx on gigs(slug);
create index if not exists gigs_status_idx on gigs(status);

-- ---------- orders ----------
create table if not exists orders (
  id                       uuid primary key default gen_random_uuid(),
  gig_id                   uuid references gigs(id) on delete set null,
  gig_title                text not null default '',
  gig_cover_image          text,
  seller_id                text not null,
  buyer_id                 text not null,
  tier                     text not null check (tier in ('basic','standard','premium')),
  price                    numeric not null default 0,
  service_fee              numeric not null default 0,
  total_amount             numeric not null default 0,
  delivery_days            int     not null default 0,
  delivery_deadline        timestamptz,
  status                   text not null default 'active'
                           check (status in ('pending_payment','active','in_progress','delivered','revision_requested','completed','cancelled','disputed')),
  requirements             text,
  deliverables             jsonb not null default '[]',
  revision_count           int  not null default 0,
  max_revisions            int  not null default 0,
  stripe_session_id        text,
  stripe_payment_intent_id text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  completed_at             timestamptz
);
create index if not exists orders_seller_id_idx on orders(seller_id);
create index if not exists orders_buyer_id_idx on orders(buyer_id);
create index if not exists orders_gig_id_idx on orders(gig_id);

-- ---------- conversations ----------
create table if not exists conversations (
  id                  uuid primary key default gen_random_uuid(),
  participants        text[] not null default '{}',
  participant_names   jsonb  not null default '{}',
  participant_photos  jsonb  not null default '{}',
  last_message        text,
  last_message_at     timestamptz not null default now(),
  last_message_by     text,
  unread_count        jsonb  not null default '{}',
  related_gig_id      uuid,
  related_order_id    uuid,
  created_at          timestamptz not null default now()
);
create index if not exists conversations_participants_idx on conversations using gin(participants);

-- ---------- messages ----------
create table if not exists messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references conversations(id) on delete cascade,
  sender_id        text not null,
  sender_name      text not null default 'User',
  content          text not null,
  type             text not null default 'text' check (type in ('text','file','system')),
  file_url         text,
  file_name        text,
  read             boolean not null default false,
  created_at       timestamptz not null default now()
);
create index if not exists messages_conversation_id_idx on messages(conversation_id);

-- ---------- reviews ----------
create table if not exists reviews (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid references orders(id) on delete set null,
  gig_id           uuid references gigs(id) on delete cascade,
  seller_id        text not null,
  buyer_id         text not null,
  rating           int  not null check (rating between 1 and 5),
  comment          text not null default '',
  seller_response  text,
  created_at       timestamptz not null default now()
);
create index if not exists reviews_gig_id_idx on reviews(gig_id);
create index if not exists reviews_seller_id_idx on reviews(seller_id);
create index if not exists reviews_buyer_id_idx on reviews(buyer_id);

-- ---------- notifications ----------
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  type        text not null check (type in ('message','order','review','system')),
  title       text not null,
  message     text not null default '',
  link        text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists notifications_user_id_idx on notifications(user_id);

-- ---------- enable Row Level Security ----------
-- Server uses the service-role key which bypasses RLS. Enabling RLS with
-- no policies locks these tables to server-only access (no public reads).
alter table profiles       enable row level security;
alter table gigs           enable row level security;
alter table orders         enable row level security;
alter table conversations  enable row level security;
alter table messages       enable row level security;
alter table reviews        enable row level security;
alter table notifications  enable row level security;

-- ---------- realtime ----------
-- The dashboard subscribes to live updates on these three.
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;
alter publication supabase_realtime add table notifications;

-- ============================================================
-- Storage buckets
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('gig-images',          'gig-images',          true),
  ('profile-images',      'profile-images',      true),
  ('deliverables',        'deliverables',        false),
  ('message-attachments', 'message-attachments', false)
on conflict (id) do nothing;

-- Public read for the two public buckets (uploads go through the
-- server-side service-role key, which bypasses these policies).
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'orbit_public_read_gig_images') then
    create policy "orbit_public_read_gig_images" on storage.objects
      for select using (bucket_id = 'gig-images');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'orbit_public_read_profile_images') then
    create policy "orbit_public_read_profile_images" on storage.objects
      for select using (bucket_id = 'profile-images');
  end if;
end $$;
