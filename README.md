# Telemedicine Booking Platform (Mini-DoctorAnywhere)

A free, bilingual (Vietnamese/English) telemedicine platform that enables patients to browse doctors, book appointments, and manage consultations securely.

**Author:** TanQHoang (hoangquoctan.1996@gmail.com)
**Started:** April 10, 2026
**Last updated:** April 11, 2026
**Live:** https://telemedicine-booking-platform-mini.vercel.app/en

---

## Live Features (Phase 2 ✅)

- **Bilingual UI** — Full Vietnamese / English with live EN | VI switcher
- **Doctor Directory** — 5 doctor profiles with specialties, ratings, and availability
- **JWT Authentication** — Register, login, logout with HttpOnly session cookies
- **Patient Portal** — Dashboard with appointment stats, list, and cancellation
- **Appointment Booking** — Authenticated API with Resend email confirmation
- **Doctor pre-fill** — Clicking "Book" on a doctor card auto-fills name & specialty
- **Route Protection** — `/portal` redirects to `/login` if not authenticated
- **Toast notifications** — Success toast on sign-in
- **Locale Routing** — All pages at `/en/...` and `/vi/...`
- **Responsive Layout** — Mobile-first with collapsible navigation

---

## Tech Stack

| Layer      | Technology                                          | Status        |
|------------|-----------------------------------------------------|---------------|
| Framework  | Next.js 14.2 (App Router)                           | ✅ Active      |
| Styling    | Tailwind CSS 3.4                                    | ✅ Active      |
| i18n       | next-intl 4.9 (locale routing, SSG)                 | ✅ Active      |
| Auth       | JWT (jose) + bcryptjs                               | ✅ Live        |
| Database   | MongoDB Atlas (Free Tier)                           | ✅ Connected   |
| Email      | Resend                                              | ✅ Configured  |
| Validation | Zod                                                 | ✅ Active      |
| Hosting    | Vercel (Free Tier)                                  | ✅ Deployed    |
| CMS        | Contentful                                          | ⏳ Phase 3     |
| Video      | WebRTC                                              | ⏳ Phase 3     |

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
JWT_SECRET=<openssl rand -hex 32>
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects automatically to `/en`.

| URL | Description |
|-----|-------------|
| `/en` | Home |
| `/en/doctors` | Doctor directory |
| `/en/booking?doctorId=1&doctorName=...&specialty=...` | Pre-filled booking |
| `/en/login` | Sign in |
| `/en/register` | Create account |
| `/en/portal` | Patient dashboard (requires auth) |
| `/en/contact` | Contact |
| `/api/health` | DB connectivity check |

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Create patient account |
| POST | `/api/auth/login` | — | Sign in, set session cookie |
| POST | `/api/auth/logout` | — | Clear session cookie |
| GET | `/api/auth/me` | ✅ | Return current session |
| POST | `/api/appointments` | ✅ | Book appointment + send email |
| GET | `/api/appointments` | ✅ | List patient's appointments |
| DELETE | `/api/appointments/[id]` | ✅ | Cancel pending appointment |
| GET | `/api/health` | — | MongoDB ping |

---

## Project Structure

```
├── app/
│   ├── layout.tsx                    # Root — owns <html>, <body>
│   ├── [locale]/
│   │   ├── layout.tsx                # UserProvider + Header + Footer
│   │   ├── page.tsx                  # Home
│   │   ├── login/page.tsx            # Sign in
│   │   ├── register/page.tsx         # Create account
│   │   ├── booking/page.tsx          # Booking form
│   │   ├── doctors/page.tsx          # Doctor directory
│   │   ├── portal/page.tsx           # Patient dashboard
│   │   └── contact/page.tsx
│   └── api/
│       ├── auth/{login,register,logout,me}/
│       ├── appointments/
│       └── health/
├── components/
│   ├── auth/LoginForm.tsx            # With toast on success
│   ├── auth/RegisterForm.tsx
│   ├── auth/UserContext.tsx          # Global user state (React context)
│   ├── booking/BookingForm.tsx       # API-backed, auth-gated
│   ├── doctors/DoctorCard.tsx        # Pre-fills booking URL params
│   ├── layout/Header.tsx             # Auth-aware nav + logout
│   ├── portal/AppointmentDashboard.tsx
│   └── ui/Toast.tsx
├── lib/
│   ├── auth.ts                       # JWT sign/verify/session (lazy)
│   ├── db.ts                         # MongoDB connection (lazy)
│   ├── doctors.ts                    # Mock doctor data
│   ├── email.ts                      # Resend bilingual templates
│   └── schemas.ts                    # Zod validation schemas
├── locales/
│   ├── en.json
│   └── vi.json
└── middleware.ts                     # Locale detection + /portal auth guard
```

---

## Roadmap

### Phase 0 — Foundation ✅
- [x] Next.js 14, Tailwind, TypeScript, ESLint
- [x] `.env.example`, `.gitattributes`, `CODEOWNERS`

### Phase 1 — Static MVP ✅
- [x] next-intl v4 locale routing (`/en/...`, `/vi/...`)
- [x] 5 pages, bilingual, responsive
- [x] Formspree booking form
- [x] Live EN/VI switcher
- [x] Deployed on Vercel

### Phase 2 — Auth & Database ✅
- [x] MongoDB Atlas connected
- [x] JWT register / login / logout / me
- [x] Appointments API (create, list, cancel)
- [x] Patient portal dashboard with stats
- [x] Resend email confirmation (bilingual)
- [x] Zod validation on all API routes
- [x] Middleware auth guard on `/portal`
- [x] Toast notification on sign-in
- [x] Doctor pre-fill in booking form

### Phase 3 — Advanced Features ⏳
- [ ] Rate limiting on `/api/auth/login`
- [ ] Contentful CMS — doctor profiles
- [ ] ISR on doctor pages
- [ ] WebRTC video consultation
- [ ] Vercel Analytics
- [ ] SEO — sitemap, robots.txt, `generateMetadata()`
- [ ] Lighthouse score ≥ 90

---

## Deployment

Pushes to `main` auto-deploy to Vercel.

**Required Vercel environment variables:**

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | 64-char hex string |
| `RESEND_API_KEY` | From resend.com |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL |
| `NEXT_PUBLIC_FORMSPREE_ID` | `xwvwdqvp` |

---

## Security

- JWT in HttpOnly, Secure, SameSite=Strict cookies — never localStorage
- bcrypt passwords (12 rounds) — `passwordHash` never returned in responses
- Constant-time password comparison (timing-attack safe)
- Zod validation on all API request bodies
- All secrets in env vars — never hardcoded
- HTTPS via Vercel
- `CODEOWNERS` — only `@TanQHoang` can merge

---

## License

Private project — all rights reserved.
