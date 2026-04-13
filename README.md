# Telemedicine Booking Platform (Mini-DoctorAnywhere)

A free, bilingual (Vietnamese/English) telemedicine platform enabling patients to browse doctors, book appointments, and manage consultations securely.

**Author:** TanQHoang (hoangquoctan.1996@gmail.com)
**Started:** April 10, 2026
**Last updated:** April 13, 2026 (Phase 4 — Doctor portal)
**Live:** https://telemedicine-booking-platform-mini.vercel.app/en

---

## Live Features

- **Bilingual UI** — Full Vietnamese / English with live EN | VI switcher
- **Doctor Directory** — 5 doctor profiles with specialties, ratings, and availability
- **JWT Authentication** — Register, login, logout with HttpOnly session cookies
- **Patient Portal** — Dashboard with appointment stats, list, and cancellation
- **Appointment Booking** — Authenticated API, doctor pre-fill from directory
- **Admin Panel** — Password-protected dashboard to confirm/cancel all appointments
- **Doctor Portal** — Doctors register/login to view their own appointments and join video calls
- **Triple notification** — Patient confirmation email + admin Resend email + Formspree → Gmail
- **Patient status email** — Patient notified when admin confirms or cancels
- **Route protection** — `/portal`, `/admin`, `/doctor` guarded by middleware JWT checks
- **Rate limiting** — Sliding-window per-IP limits on login (5/min) and register (3/10min)
- **SEO** — Per-page `generateMetadata`, OpenGraph tags, XML sitemap, robots.txt
- **Vercel Analytics** — Page-view and performance tracking via `@vercel/analytics`
- **WebRTC video** — Daily.co rooms created on confirm; Join Call buttons in patient, admin, and doctor portals
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
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_PASSWORD=<your admin password>
ADMIN_EMAIL=<your gmail>
ADMIN_URL=https://your-vercel-url.vercel.app
DAILY_API_KEY=<your daily.co api key>      # optional — disables video if omitted
CONTENTFUL_SPACE_ID=<space id>             # optional — falls back to mock doctors
CONTENTFUL_ACCESS_TOKEN=<token>
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
| `/en/booking` | Book appointment (patient auth required) |
| `/en/login` | Patient sign in |
| `/en/register` | Create patient account |
| `/en/portal` | Patient appointment dashboard |
| `/en/admin/login` | Admin sign in |
| `/en/admin` | Admin appointment dashboard (confirm/cancel/join call) |
| `/en/doctor/login` | Doctor sign in |
| `/en/doctor/register` | Doctor registration |
| `/en/doctor` | Doctor appointment dashboard (join call) |
| `/en/call?url=...` | Video call page (Daily.co iframe) |
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
| PATCH | `/api/admin/appointments/[id]` | Admin | Confirm or cancel + create Daily room + notify patient |
| POST | `/api/doctor/register` | — | Create doctor account |
| POST | `/api/doctor/login` | — | Doctor sign in, set doctor_session cookie |
| POST | `/api/doctor/logout` | — | Clear doctor session |
| GET | `/api/doctor/appointments` | Doctor | List appointments for this doctor |
| GET | `/api/health` | — | MongoDB ping |

---

## Notification Flow

```
Patient books appointment
  ├── MongoDB stores appointment
  ├── Resend → patient confirmation email (EN/VI)
  ├── Resend → admin notification email (with link to admin panel)
  └── Formspree → admin Gmail (backup)

Admin confirms
  ├── Daily.co REST API creates video room (if DAILY_API_KEY set)
  ├── roomUrl stored on appointment document
  └── Resend → patient status update email (EN/VI, includes join link)

Admin cancels
  └── Resend → patient status update email (EN/VI)
```

---

## Project Structure

```
├── app/
│   ├── layout.tsx                    # Root — owns <html>, <body>
│   ├── [locale]/
│   │   ├── layout.tsx                # UserProvider + LayoutShell (Header/Footer)
│   │   ├── page.tsx                  # Home
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── booking/page.tsx
│   │   ├── doctors/page.tsx
│   │   ├── portal/page.tsx           # Patient dashboard
│   │   ├── call/page.tsx             # Video call (Daily.co iframe)
│   │   ├── admin/layout.tsx          # Suppresses site nav for admin
│   │   ├── admin/page.tsx            # Admin dashboard (force-dynamic)
│   │   ├── admin/login/page.tsx
│   │   ├── doctor/layout.tsx         # Suppresses site nav for doctor
│   │   ├── doctor/page.tsx           # Doctor dashboard (force-dynamic)
│   │   ├── doctor/login/page.tsx
│   │   └── doctor/register/page.tsx
│   └── api/
│       ├── auth/{login,register,logout,me}/
│       ├── appointments/ + appointments/[id]/
│       ├── admin/{login,logout}/
│       ├── admin/appointments/ + admin/appointments/[id]/
│       ├── doctor/{login,register,logout,appointments}/
│       └── health/
├── components/
│   ├── admin/AdminDashboard.tsx      # Table + filter tabs + confirm/cancel + Join Call
│   ├── admin/AdminLoginForm.tsx
│   ├── admin/AdminLogoutButton.tsx
│   ├── auth/LoginForm.tsx            # Toast on success
│   ├── auth/RegisterForm.tsx
│   ├── auth/UserContext.tsx          # Global patient user state
│   ├── doctor/DoctorDashboard.tsx    # Filter tabs + table + Join Call
│   ├── doctor/DoctorLoginForm.tsx
│   ├── doctor/DoctorRegisterForm.tsx
│   ├── doctor/DoctorLogoutButton.tsx
│   ├── booking/BookingForm.tsx       # API-backed, auth-gated, doctor pre-fill
│   ├── doctors/DoctorCard.tsx        # Passes doctorName+specialty in URL
│   ├── layout/Header.tsx             # Auth-aware nav + logout
│   ├── layout/Footer.tsx             # Locale-aware links
│   ├── layout/LayoutShell.tsx        # Hides Header/Footer on /admin/* and /doctor/*
│   ├── portal/AppointmentDashboard.tsx
│   ├── video/VideoCallFrame.tsx      # Daily.co iframe + Leave Call button
│   └── ui/Toast.tsx
├── lib/
│   ├── adminAuth.ts                  # Admin JWT verification helper
│   ├── doctorAuth.ts                 # Doctor JWT verification helper
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
└── middleware.ts                     # Locale + /portal + /admin + /doctor JWT guards
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
- [x] Middleware JWT guards on /portal and /admin

### Phase 3 — Advanced Features ✅ (Apr 12–13)
- [x] Rate limiting — `/api/auth/login` (5/min) + `/api/auth/register` (3/10min)
- [x] SEO — `generateMetadata()` + OpenGraph on all public pages
- [x] Sitemap + Robots
- [x] Vercel Analytics
- [x] Lighthouse ≥ 90 — `next/image`, `lang` attribute via `LangSetter`
- [x] Contentful CMS — ISR 1hr, MOCK_DOCTORS fallback
- [x] WebRTC video — Daily.co rooms on confirm, `/call` page, Join buttons

### Phase 4 — Doctor Portal ✅ (Apr 13)
- [x] Doctor registration and login (`doctor_session` JWT, 8h HttpOnly cookie)
- [x] Doctor dashboard — filter tabs + table (same style as admin)
- [x] Join Call button for all confirmed appointments (active/grayed by roomUrl)
- [x] Middleware guard on `/doctor` routes
- [x] No site Header/Footer on doctor pages (own layout segment)

---

## Deployment

Pushes to `main` auto-deploy to Vercel.

**Required Vercel environment variables:**

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | 64-char hex string |
| `RESEND_API_KEY` | From resend.com |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `ADMIN_PASSWORD` | Admin panel password |
| `ADMIN_EMAIL` | Admin Gmail for notifications |
| `ADMIN_URL` | Your Vercel URL (used in notification emails) |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL |
| `NEXT_PUBLIC_FORMSPREE_ID` | `xwvwdqvp` |
| `DAILY_API_KEY` | Daily.co API key (optional — video disabled if omitted) |
| `CONTENTFUL_SPACE_ID` | Contentful space (optional — falls back to mock doctors) |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful delivery token |

---

## Security

- JWT in HttpOnly, Secure, SameSite=Strict cookies — never localStorage
- Three separate session cookies: `session` (patient), `admin_session` (admin), `doctor_session` (doctor)
- bcrypt passwords (12 rounds) — `passwordHash` never returned in responses
- Constant-time password comparison (timing-attack safe)
- Zod validation on all API request bodies
- Rate limiting on auth endpoints (login 5/min, register 3/10min per IP)
- All secrets in env vars — never hardcoded
- HTTPS via Vercel

---

## License

Private project — all rights reserved.
