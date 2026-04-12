# Telemedicine Booking Platform (Mini-DoctorAnywhere)

A free, bilingual (Vietnamese/English) telemedicine platform enabling patients to browse doctors, book appointments, and manage consultations securely.

**Author:** TanQHoang (hoangquoctan.1996@gmail.com)
**Started:** April 10, 2026
**Last updated:** April 11, 2026 (Phase 3 — rate limiting + SEO)
**Live:** https://telemedicine-booking-platform-mini.vercel.app/en

---

## Live Features

- **Bilingual UI** — Full Vietnamese / English with live EN | VI switcher
- **Doctor Directory** — 5 doctor profiles with specialties, ratings, and availability
- **JWT Authentication** — Register, login, logout with HttpOnly session cookies
- **Patient Portal** — Dashboard with appointment stats, list, and cancellation
- **Appointment Booking** — Authenticated API, doctor pre-fill from directory
- **Admin Panel** — Password-protected dashboard to confirm/cancel all appointments
- **Triple notification** — Patient confirmation email + admin Resend email + Formspree → Gmail
- **Patient status email** — Patient notified when admin confirms or cancels
- **Route protection** — `/portal` and `/admin` guarded by middleware JWT check
- **Rate limiting** — Sliding-window per-IP limits on login (5/min) and register (3/10min)
- **SEO** — Per-page `generateMetadata`, OpenGraph tags, XML sitemap, robots.txt
- **Vercel Analytics** — Page-view and performance tracking via `@vercel/analytics`
- **Toast notifications** — Success/error feedback on key actions
- **Responsive layout** — Mobile-first, collapsible nav

---

## Tech Stack

| Layer      | Technology                        | Status       |
|------------|-----------------------------------|--------------|
| Framework  | Next.js 14.2 (App Router)         | ✅ Active     |
| Styling    | Tailwind CSS 3.4                  | ✅ Active     |
| i18n       | next-intl 4.9                     | ✅ Active     |
| Auth       | JWT (jose) + bcryptjs             | ✅ Live       |
| Database   | MongoDB Atlas (Free Tier)         | ✅ Connected  |
| Email      | Resend                            | ✅ Live       |
| Backup notify | Formspree → Gmail              | ✅ Live       |
| Validation | Zod                               | ✅ Active     |
| Rate limit | lru-cache (sliding window)        | ✅ Active     |
| Analytics  | Vercel Analytics                  | ✅ Active     |
| Hosting    | Vercel (Free Tier)                | ✅ Deployed   |
| CMS        | Contentful SDK v11                | ✅ Integrated |
| Video      | Daily.co (REST API + iframe)      | ✅ Integrated |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/tanhoang0803/Telemedicine-Booking-Platform-Mini-DoctorAnywhere-.git
cd Telemedicine-Booking-Platform-Mini-DoctorAnywhere-
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FORMSPREE_ID=xwvwdqvp
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/telemedicine?appName=Cluster0
JWT_SECRET=<64-char hex string>
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
ADMIN_PASSWORD=<your admin password>
ADMIN_EMAIL=<your gmail>
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/en`.

---

## Key URLs

| URL | Description |
|-----|-------------|
| `/en` | Home |
| `/en/doctors` | Doctor directory |
| `/en/booking` | Book appointment (auth required) |
| `/en/login` | Patient sign in |
| `/en/register` | Create patient account |
| `/en/portal` | Patient dashboard (auth required) |
| `/en/admin/login` | Admin sign in |
| `/en/admin` | Admin appointment dashboard |
| `/api/health` | MongoDB connectivity check |

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Create patient account |
| POST | `/api/auth/login` | — | Sign in, set session cookie |
| POST | `/api/auth/logout` | — | Clear session cookie |
| GET | `/api/auth/me` | Patient | Return current session |
| POST | `/api/appointments` | Patient | Book + notify patient + admin + Formspree |
| GET | `/api/appointments` | Patient | List own appointments |
| DELETE | `/api/appointments/[id]` | Patient | Cancel pending appointment |
| POST | `/api/admin/login` | — | Admin sign in (ADMIN_PASSWORD) |
| POST | `/api/admin/logout` | — | Clear admin session |
| GET | `/api/admin/appointments` | Admin | List all appointments |
| PATCH | `/api/admin/appointments/[id]` | Admin | Confirm or cancel + notify patient |
| GET | `/api/health` | — | MongoDB ping |

---

## Notification Flow

```
Patient books appointment
  ├── MongoDB stores appointment
  ├── Resend → patient confirmation email (EN/VI)
  ├── Resend → admin notification email (with link to admin panel)
  └── Formspree → admin Gmail (backup)

Admin confirms or cancels
  └── Resend → patient status update email (EN/VI)
```

---

## Project Structure

```
├── app/
│   ├── layout.tsx                    # Root — owns <html>, <body>
│   ├── [locale]/
│   │   ├── layout.tsx                # UserProvider + Header + Footer
│   │   ├── page.tsx                  # Home
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── booking/page.tsx
│   │   ├── doctors/page.tsx
│   │   ├── portal/page.tsx           # Patient dashboard
│   │   ├── admin/page.tsx            # Admin dashboard (force-dynamic)
│   │   └── admin/login/page.tsx
│   └── api/
│       ├── auth/{login,register,logout,me}/
│       ├── appointments/ + appointments/[id]/
│       ├── admin/{login,logout}/
│       ├── admin/appointments/ + admin/appointments/[id]/
│       └── health/
├── components/
│   ├── admin/AdminDashboard.tsx      # Table with filter tabs + confirm/cancel
│   ├── admin/AdminLoginForm.tsx
│   ├── admin/AdminLogoutButton.tsx
│   ├── auth/LoginForm.tsx            # Toast on success
│   ├── auth/RegisterForm.tsx
│   ├── auth/UserContext.tsx          # Global user state
│   ├── booking/BookingForm.tsx       # API-backed, auth-gated, doctor pre-fill
│   ├── doctors/DoctorCard.tsx        # Passes doctorName+specialty in URL
│   ├── layout/Header.tsx             # Auth-aware nav + logout
│   ├── portal/AppointmentDashboard.tsx
│   └── ui/Toast.tsx
├── lib/
│   ├── adminAuth.ts                  # Admin JWT verification helper
│   ├── auth.ts                       # Patient JWT + session cookie options
│   ├── db.ts                         # MongoDB lazy-init connection
│   ├── doctors.ts                    # Mock doctor data
│   ├── email.ts                      # Resend: booking confirm + admin notify + status update
│   ├── contentful.ts                 # Contentful client + fetchDoctors() with fallback
│   ├── daily.ts                      # Daily.co REST client — createDailyRoom()
│   ├── rateLimit.ts                  # LRU sliding-window rate limiter
│   └── schemas.ts                    # Zod validation schemas
├── locales/en.json + vi.json
├── app/sitemap.ts                    # XML sitemap (all locale + route combos)
├── app/robots.ts                     # Crawler rules — blocks /admin/ and /api/
└── middleware.ts                     # Locale + /portal + /admin JWT guards
```

---

## Roadmap

### Phase 0 — Foundation ✅ (Apr 10)
- [x] Next.js 14, Tailwind, TypeScript, ESLint, Vercel CI/CD

### Phase 1 — Static MVP ✅ (Apr 10)
- [x] next-intl v4 locale routing, 5 bilingual pages, Formspree form, Vercel deploy

### Phase 2 — Auth & Database ✅ (Apr 11)
- [x] MongoDB Atlas, JWT auth, patient portal, appointments API
- [x] Admin panel with confirm/cancel and triple notification system
- [x] Resend emails (patient confirmation + admin alert + status update)
- [x] Formspree Gmail backup notification
- [x] Middleware JWT guards on /portal and /admin

### Phase 3 — Advanced Features ⏳ (in progress)
- [x] Rate limiting — `/api/auth/login` (5/min) + `/api/auth/register` (3/10min)
- [x] SEO — `generateMetadata()` + OpenGraph on all public pages
- [x] Sitemap — `app/sitemap.ts` covering all locale + route combos
- [x] Robots — `app/robots.ts` blocking `/admin/` and `/api/` from crawlers
- [x] Vercel Analytics — `@vercel/analytics` wired into root layout
- [x] Lighthouse ≥ 90 — `next/image` in DoctorCard, `lang` attribute via `LangSetter`
- [x] Contentful CMS — `lib/contentful.ts`, ISR 1hr revalidation, MOCK_DOCTORS fallback
- [x] WebRTC video — Daily.co rooms created on confirm, `/call` page (iframe embed), Join buttons in portal + admin

---

## Deployment

Pushes to `main` auto-deploy to Vercel.

**Required Vercel environment variables:**

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | 64-char hex string |
| `RESEND_API_KEY` | From resend.com |
| `ADMIN_PASSWORD` | Admin panel password |
| `ADMIN_EMAIL` | Admin Gmail for notifications |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL |
| `NEXT_PUBLIC_FORMSPREE_ID` | `xwvwdqvp` |

---

## Security

- JWT in HttpOnly, Secure, SameSite=Strict cookies — never localStorage
- Separate patient and admin session cookies
- bcrypt passwords (12 rounds) — `passwordHash` never returned in responses
- Constant-time password comparison (timing-attack safe)
- Zod validation on all API request bodies
- Rate limiting on auth endpoints (login 5/min, register 3/10min per IP)
- All secrets in env vars — never hardcoded
- HTTPS via Vercel

---

## License

Private project — all rights reserved.
