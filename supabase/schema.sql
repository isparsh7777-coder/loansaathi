-- LoanSaathi — initial Supabase schema
-- Run in the Supabase SQL editor, or via `supabase db push` once you have
-- the CLI linked to your project.

create extension if not exists "pgcrypto";

-- Customers (linked 1:1 with Supabase auth.users after OTP login)
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users (id) on delete set null,
  mobile_number text not null unique,
  full_name text,
  email text,
  address text,
  preferred_language text not null default 'en' check (preferred_language in ('en', 'hi')),
  password_hash text,
  created_at timestamptz not null default now()
);

-- Lending partners (managed from the admin panel)
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  partner_type text not null check (partner_type in ('bank', 'nbfc', 'dsa', 'other')),
  loan_types text[] not null,
  min_amount numeric not null,
  max_amount numeric not null,
  min_tenure_years int not null,
  max_tenure_years int not null,
  indicative_apr_min numeric,
  indicative_apr_max numeric,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Loan applications
create table if not exists loan_applications (
  id text primary key, -- human-readable e.g. LS-20260810-0001
  customer_id uuid not null references customers (id) on delete cascade,
  loan_type text not null check (loan_type in ('personal', 'business', 'home', 'vehicle', 'education')),
  requested_amount numeric not null,
  tenure_years int not null,
  employment_type text check (employment_type in ('salaried', 'self_employed', 'business_owner', 'professional', 'other')),
  monthly_income numeric,
  purpose text,
  credit_consent_given boolean not null default false,
  credit_consent_at timestamptz,
  status text not null default 'submitted' check (status in (
    'submitted', 'under_review', 'more_info_required', 'eligible',
    'not_eligible', 'referred_to_partner', 'lender_decision_pending',
    'approved_by_lender', 'disbursed'
  )),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  service_charge_amount numeric,
  cashfree_order_id text,
  matched_partner_id uuid references partners (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Full audit trail of status changes (RBI guidance emphasizes clear audit trails)
create table if not exists application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id text not null references loan_applications (id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by text, -- admin user id/email, or 'system'
  note text,
  created_at timestamptz not null default now()
);

-- Which auth.users are allowed into the /admin panel. There is no
-- self-signup for this table on purpose — add rows manually (see README).
create table if not exists admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_at timestamptz not null default now()
);

create index if not exists idx_applications_customer on loan_applications (customer_id);
create index if not exists idx_applications_status on loan_applications (status);
create index if not exists idx_status_history_application on application_status_history (application_id);

-- Row Level Security
alter table customers enable row level security;
alter table loan_applications enable row level security;
alter table application_status_history enable row level security;
alter table partners enable row level security;
alter table admin_users enable row level security;

-- Only an existing admin can read the admin_users table (used by
-- middleware.ts to gate /admin access). No insert/update/delete policy is
-- defined here on purpose — manage this table from the Supabase dashboard
-- or via the service role key, not from client code.
-- FIXED: this used to check "is this user an admin" by querying
-- admin_users FROM WITHIN the admin_users policy itself — a chicken-and-egg
-- deadlock where nobody could ever pass the check. A user can simply see
-- their own row directly; that's all middleware.ts needs.
create policy "users can view own admin_users row"
  on admin_users for select
  using (user_id = auth.uid());

-- Admins can view and update every application, not just their own.
create policy "admins can view all applications"
  on loan_applications for select
  using (
    exists (select 1 from admin_users au where au.user_id = auth.uid())
  );

create policy "admins can update all applications"
  on loan_applications for update
  using (
    exists (select 1 from admin_users au where au.user_id = auth.uid())
  );

create policy "admins can view status history"
  on application_status_history for select
  using (
    exists (select 1 from admin_users au where au.user_id = auth.uid())
  );

create policy "admins can insert status history"
  on application_status_history for insert
  with check (
    exists (select 1 from admin_users au where au.user_id = auth.uid())
  );

create policy "admins can manage partners"
  on partners for all
  using (
    exists (select 1 from admin_users au where au.user_id = auth.uid())
  );

-- Customers can only read/update their own row
create policy "customers can view own profile"
  on customers for select
  using (auth.uid() = auth_user_id);

create policy "customers can update own profile"
  on customers for update
  using (auth.uid() = auth_user_id);

-- Customers can only see their own applications
create policy "customers can view own applications"
  on loan_applications for select
  using (
    customer_id in (select id from customers where auth_user_id = auth.uid())
  );

-- NOTE: Admin access should go through a service-role server route
-- (never the anon key), with the calling user's role checked server-side
-- against a separate `admin_users` table before any write.
