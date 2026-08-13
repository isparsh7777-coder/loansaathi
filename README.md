# LoanSaathi

Mobile-first loan application assistance platform. Next.js 14 (App Router) +
TypeScript + Tailwind CSS + Supabase + Cashfree, deployable to Vercel.

## Stack

- **Framework:** Next.js 14, App Router, TypeScript
- **Styling:** Tailwind CSS (design tokens in `tailwind.config.ts`)
- **Auth/DB:** Supabase (Postgres + Auth + RLS)
- **Payments:** Cashfree (stubbed until explicitly enabled — see below)
- **Hosting:** Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase + Cashfree values
npm run dev
```

Then in the Supabase SQL editor, run `supabase/schema.sql` to create the
tables, indexes and RLS policies.

## Project structure

```
app/
  page.tsx                 Homepage
  personal-loan/ ...        Loan category landing pages (SEO)
  how-it-works/              
  track-application/         Mobile + OTP status lookup
  help/                       FAQ
  apply/                     7-step application flow
    otp/ loan-type/ personal-details/ employment/
    loan-amount/ tenure/ credit-consent/ review/ payment/ submitted/
  dashboard/                 Customer dashboard (post-login)
  admin/                      Admin panel (dashboard + applications table)
  legal/                      Terms, privacy, refund policy, disclaimer
  api/apply/create-order/    Cashfree order creation (server-only)
  api/webhooks/cashfree/     Cashfree webhook handler
components/                  Shared UI (Header, Footer, BottomNav, etc.)
lib/
  supabase/                  Browser + server Supabase clients
  cashfree.ts                 Order creation + webhook verification
  types.ts                    Shared domain types
supabase/schema.sql           Database schema + RLS policies
```

## Setting up the new features

### ⚠️ If you already ran the old schema.sql — fix the admin login bug
An earlier version of `admin_users`' RLS policy had a self-referencing logic
error (checking "is this user an admin" by querying `admin_users` from
within `admin_users`'s own policy — a deadlock nobody could pass). If your
admin login says "not set up as an admin yet" even after inserting yourself
into `admin_users`, run this once in the Supabase SQL Editor:
```sql
drop policy if exists "admins can view admin_users" on admin_users;
create policy "users can view own admin_users row"
  on admin_users for select
  using (user_id = auth.uid());
```
The updated `schema.sql` already has this fix baked in for fresh installs.

### Application data now actually persists
Earlier, the apply flow only kept form state in memory per-page and the
payment step used hardcoded placeholder values — so nothing showed up when
tracking an application. This is fixed: the whole flow now shares state via
`lib/applyContext.tsx`, and a real `loan_applications` row is created (via
`/api/applications/create`) when you hit Submit on the review step, using
your real verified mobile number and a generated Application ID. That ID is
what flows through to payment, the submitted screen, and your dashboard.

### Session behavior
Customer login (`ls_session` cookie) is now a true browser-session cookie —
it clears when the browser is fully closed, or immediately on tapping
"Log out" in the profile menu (top-right of the header). It does not
persist for 30 days anymore.

### Admin login (real Supabase Auth)
1. Run the updated `supabase/schema.sql` (adds the `admin_users` table + RLS).
2. In the Supabase dashboard → Authentication → Users → **Add user**, create
   an account with your admin's email/password.
3. In the SQL Editor, run:
   ```sql
   insert into admin_users (user_id, full_name)
   values ('<paste the user's UUID from the Users tab>', 'Your Name');
   ```
4. Visit `/admin/login` and sign in. There is deliberately no admin
   self-signup — only rows you manually insert into `admin_users` can get in.

### Phone OTP login
This uses Supabase Auth's built-in phone sign-in — no separate OTP vendor
code needed. You still need an SMS provider account behind it:
1. Supabase Dashboard → Authentication → Providers → **Phone** → enable it.
2. Pick a provider (Twilio, Twilio Verify, MessageBird, Vonage, or
   Textlocal) and enter its credentials there. Each of these needs its own
   account and has its own per-SMS cost.
3. Test with a real phone number — Supabase's phone auth doesn't have a
   free/sandbox SMS mode.

### Real Cashfree checkout
1. Set `CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET`, `CASHFREE_WEBHOOK_SECRET`
   from your Cashfree dashboard.
2. Set `NEXT_PUBLIC_SITE_URL` to your real deployed domain (needed for the
   payment return redirect).
3. Leave `CASHFREE_CHARGES_ENABLED=false` and `NEXT_PUBLIC_CASHFREE_MODE=sandbox`
   while testing — this uses Cashfree's sandbox, no real money moves.
4. In Cashfree dashboard → Webhooks, point the webhook URL at
   `https://your-domain.com/api/webhooks/cashfree`.
5. Only once you've tested a full sandbox payment end-to-end, and confirmed
   your DSA/LSP agreement permits borrower-side charges, flip
   `CASHFREE_CHARGES_ENABLED=true` and switch to your live Cashfree keys.

### 2Factor OTP (custom flow, not Supabase phone auth)
Supabase's built-in phone auth doesn't support 2Factor, so OTP is handled by
custom API routes (`/api/otp/send`, `/api/otp/verify`) that call 2Factor
directly and issue our own signed session cookie.
1. Get your API key from 2factor.in and set `TWO_FACTOR_API_KEY`.
2. Set `CUSTOMER_SESSION_SECRET` to a long random string (`openssl rand -hex 32`).
3. Until `TWO_FACTOR_API_KEY` is set, OTP runs in demo mode — any mobile
   number works, and the OTP is always `123456`. This is safe to test with
   before your 2Factor key arrives.

### Password-based login + signup (replaces OTP-every-time)
Customers now create a real account: mobile number → OTP (once) → set a
password. After that, logging in only needs mobile + password — no OTP,
unless they use "Forgot password" (which requires OTP again, for security).
- Sessions last **12 hours**, then auto-expire — matches "log out
  automatically after 12 hours." Manual logout via the profile menu clears
  it immediately either way.
- If someone is already logged in and taps GET LOAN, the login/signup step
  is skipped entirely and they go straight into the application.
- New standalone `/login` page (used by the header's Login button) and
  `/track-application` both reuse the same login/signup panel.

### Escalating OTP + login lockout
Wrong OTP attempts (and wrong password attempts) trigger escalating
lockouts per mobile number: 1 min → 2 min → 5 min → 1 hour → 12 hours →
36 hours, resetting on a successful attempt. This is on top of the
existing per-IP rate limits. Like the other in-memory rate limiting, this
resets on redeploy and doesn't coordinate across multiple server instances
— fine for launch, worth moving to Redis/Upstash once you have real scale.

### Admin: full application detail view
Each application in `/admin/applications` now links to
`/admin/applications/[id]` — shows every field the applicant submitted
(contact info, address, income, purpose, consent, payment/order details)
plus the full status-change history, with the same status/payment-override
controls available inline.

### On "hiding the APIs"
Every website's API calls are visible in the browser's Network tab —
that's unavoidable and true of every site, including banks. What actually
matters (and is already true here): no secret keys are ever sent to the
browser, every write operation re-checks authorization server-side, and
every route is rate-limited. That's the real version of this request.

### Live chat (Tawk.to) + email support
Set `NEXT_PUBLIC_TAWKTO_PROPERTY_ID` and `NEXT_PUBLIC_TAWKTO_WIDGET_ID` (from
your Tawk.to dashboard → Administration → Chat Widget) to enable the Live
Chat button on `/help`. Until then, the button silently does nothing — add
the keys when you have them. "Email Us" always points to
support@loansaathi.online — make sure that inbox is actually monitored.

### Auto-reject stale applications after 3 months
`app/api/cron/expire-applications` marks any application still pending
after 3 months as `not_eligible`, with a full audit trail entry. It's
wired to run daily via `vercel.json`'s cron config. Set `CRON_SECRET` to a
random string (`openssl rand -hex 32`) — Vercel Cron sends it automatically
once configured in Project Settings → Cron Jobs.

### Manual payment approval (when Cashfree can't confirm)
On `/admin/applications`, each row's "Update" menu includes a **Manual
Payment Override** section — use it when Cashfree shows a payment as
cancelled or stuck processing, but you've separately confirmed the money
came through. Every override is logged to `application_status_history`
with your admin email attached, so there's always a paper trail.

## Security measures in place

- **Secrets never reach the browser.** Cashfree keys, 2Factor key, Supabase
  service role key, session-signing secret, and cron secret are only ever
  read in server-only files (API routes, `lib/` server modules) — verified
  by grepping for every non-`NEXT_PUBLIC_` env var reference and confirming
  none are imported by a `"use client"` file.
- **`.gitignore` added** so `.env.local` (or any real secrets file) can
  never be accidentally committed to GitHub. Only `.env.example` (with
  blank placeholder values) is meant to be in the repo.
- **Rate limiting** on every state-changing or lookup API route: OTP
  send/verify, application creation, payment order creation, payment
  confirmation, order-status checks, `customer/me`, and both admin action
  routes — each keyed by IP and/or session so one abusive client can't burn
  through your SMS/payment gateway credits or hammer the database.
- **Server-side validation** duplicates every client-side form rule (name
  length, PAN format, Aadhaar format, pincode, income range) on
  `/api/applications/create` — client-side checks alone can always be
  bypassed by calling the API directly.
- **Row Level Security** on every table; admin routes additionally check a
  server-side `admin_users` lookup in middleware before rendering anything.
- **HttpOnly, Secure, SameSite cookies** for both customer and OTP sessions
  — never readable by client-side JavaScript, which blocks the most common
  session-theft technique (XSS reading `document.cookie`).
- **Signed, tamper-proof session tokens** (`lib/customerAuth.ts`) using
  HMAC-SHA256 with constant-time comparison, not a guessable ID.
- **Security headers** (HSTS, X-Frame-Options, nosniff, referrer policy) on
  every response via `next.config.js`.
- **No verbose error leakage** — every API route returns a generic message
  to the client and logs the real error server-side only.

No system is ever 100% unhackable, and the in-memory rate limiter resets on
redeploy and won't coordinate across multiple server instances at real
scale — swap it for Upstash/Redis once you have meaningful traffic. But
this covers the standard attack surface for a launch.

## Before this goes live — read this



1. **Payment collection (`CASHFREE_CHARGES_ENABLED`).** Off by default.
   Charging a borrower a fee before any loan decision is the highest-risk
   part of this product under RBI's digital lending framework. Only enable
   real charges once you have a signed DSA/LSP agreement that permits this
   fee structure, and your Refund & Cancellation Policy has had legal review.
   See `lib/cashfree.ts` for details.

2. **Credit/CIBIL consent.** The consent screen and Supabase column exist,
   but nothing calls a real credit bureau. Don't claim to provide a CIBIL
   score unless you have an actual bureau agreement — treat the field as
   self-declared until then.

3. **Admin routes are unprotected in this scaffold.** Add auth middleware
   (Supabase Auth + a role check against an `admin_users` table) before
   deploying — `/admin/*` currently has no access control.

4. **OTP provider not wired up.** The OTP screens are UI-complete but the
   actual send/verify calls are `TODO`s — plug in your SMS provider
   (MSG91, Twilio Verify, etc.) in `app/apply/otp/page.tsx` and
   `app/track-application/page.tsx`.

5. **Legal pages are placeholders.** Terms, Privacy, Refund & Cancellation
   Policy and Loan Disclaimer need to be drafted/reviewed by an Indian
   lawyer before launch — especially given the RBI digital lending
   guidelines referenced throughout this project's brief.

6. **State across the apply flow.** Each step currently manages its own
   local form state for scaffolding purposes. Wire up a shared store
   (React context, Zustand, or incremental Supabase draft rows) so data
   entered in step 3 is available for the review screen in step 8.

## Deploying

```bash
vercel
```

Set the environment variables from `.env.example` in the Vercel project
settings (Production + Preview).
