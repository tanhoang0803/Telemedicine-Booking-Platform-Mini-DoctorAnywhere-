# Telemedicine Booking Platform (Mini-DoctorAnywhere)

A free, bilingual (Vietnamese/English) telemedicine platform that enables patients to browse doctors, book appointments, and manage consultations securely.

**Author:** TanQHoang (hoangquoctan.1996@gmail.com)
**Started:** April 10, 2026
**Current phase:** Phase 1 complete — app running locally, ready for Vercel deployment

---

## Live Features (Phase 1)

- **Bilingual UI** — Full Vietnamese / English with live EN | VI switcher in the header
- **Doctor Directory** — 5 mock doctor profiles with specialties, availability, ratings, and language badges
- **Appointment Booking** — Formspree form; pre-fills doctor when coming from the directory
- **Locale Routing** — All pages at `/en/...` and `/vi/...`; middleware auto-detects and redirects
- **Responsive Layout** — Mobile-first with collapsible navigation

---

## Tech Stack

| Layer      | Technology                                          | Status       |
|------------|-----------------------------------------------------|--------------|
| Framework  | Next.js 14.2 (App Router)                           | ✅ Active     |
| Styling    | Tailwind CSS 3.4                                    | ✅ Active     |
| i18n       | next-intl 4.9 (locale routing, SSG)                 | ✅ Active     |
| Forms      | Formspree (`xwvwdqvp`)                              | ✅ Configured |
| Auth       | JWT (jose) + bcrypt                                 | ⏳ Phase 2    |
| Database   | MongoDB Atlas (Free Tier)                           | ⏳ Phase 2    |
| Email      | Resend                                              | ⏳ Phase 2    |
| CMS        | Contentful                                          | ⏳ Phase 3    |
| Video      | WebRTC                                              | ⏳ Phase 3    |
| Hosting    | Vercel (Free Tier)                                  | ⏳ Deploy next |

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

Minimum required for Phase 1:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FORMSPREE_ID=xwvwdqvp
```

Full variable reference: see `.env.example`.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects automatically to `/en`.

| URL | Description |
|-----|-------------|
| `/en` | Home (English) |
| `/vi` | Home (Vietnamese) |
| `/en/doctors` | Doctor directory |
| `/en/booking?doctorId=1` | Booking form pre-filled for doctor 1 |
| `/en/portal` | Patient portal (Phase 2 placeholder) |
| `/en/contact` | Contact page |

---

## Project Structure

```
telemedicine-booking/
├── CLAUDE.md                         # AI assistant context and guidelines
├── README.md                         # This file
├── .claude/
│   ├── commands/                     # /memory, /review, /deploy slash commands
│   ├── skills/                       # booking.md, portal.md, cms.md
│   ├── agents/                       # bookingAgent, notificationAgent, cmsAgent
│   ├── hooks/                        # preCommit.md, postDeploy.md
│   └── settings.json                 # Claude Code permissions and hooks
├── .env.example                      # Environment variable template
├── .gitignore / .gitattributes
├── .github/
│   ├── workflows/deploy.yml          # Vercel CI/CD pipeline
│   └── CODEOWNERS                    # Restricts all PRs to @TanQHoang
├── i18n/
│   ├── routing.ts                    # Locale config (en, vi)
│   ├── request.ts                    # Loads locales/*.json per request
│   └── navigation.ts                 # Locale-aware Link, useRouter, usePathname
├── middleware.ts                     # next-intl locale detection + redirect
├── app/
│   ├── layout.tsx                    # Root layout — owns <html>, <body>, Inter font
│   ├── globals.css                   # Tailwind directives + base styles
│   ├── [locale]/                     # All user-facing routes (en | vi)
│   │   ├── layout.tsx                # NextIntlClientProvider, Header, Footer
│   │   ├── page.tsx                  # Home
│   │   ├── booking/page.tsx          # Booking form (reads ?doctorId)
│   │   ├── doctors/page.tsx          # Doctor directory
│   │   ├── portal/page.tsx           # Patient portal
│   │   ├── contact/page.tsx          # Contact
│   │   ├── loading.tsx               # Spinner
│   │   └── not-found.tsx             # 404
│   └── {booking,doctors,portal,contact}/page.tsx  # /en/* redirects
├── components/
│   ├── layout/Header.tsx             # Nav + EN/VI live switcher
│   ├── layout/Footer.tsx             # Locale-aware links
│   ├── booking/BookingForm.tsx       # Formspree + useTranslations + doctorId
│   ├── booking/BookingCalendar.tsx   # Date picker (Phase 2: availability)
│   └── doctors/DoctorCard.tsx        # Profile card + locale-aware Book link
├── lib/
│   ├── doctors.ts                    # Doctor type + 5 mock doctors
│   ├── db.ts                         # MongoDB connection (Phase 2)
│   └── auth.ts                       # JWT utilities (Phase 2)
├── locales/
│   ├── en.json                       # English translations (40+ keys)
│   └── vi.json                       # Vietnamese translations (synced)
└── public/images/
    └── doctor-placeholder.svg
```

---

## Roadmap

### Phase 0 — Project Foundation ✅
- [x] `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`
- [x] `app/layout.tsx` (root — owns `<html>`, `<body>`), `globals.css`
- [x] `.gitattributes`, `.gitignore`, `.env.example`
- [x] `.claude/settings.json`, `.github/workflows/deploy.yml`, `CODEOWNERS`
- [x] `npm run build` passes — 0 errors

### Phase 1 — Static MVP ✅
- [x] `next-intl` v4 — locale routing (`/en/...`, `/vi/...`)
- [x] `middleware.ts`, `i18n/routing.ts`, `request.ts`, `navigation.ts`
- [x] `app/[locale]/layout.tsx` — Provider, Header, Footer (no duplicate html/body)
- [x] All 5 pages with full translations (en + vi)
- [x] Header — live EN/VI switcher, stays on current path
- [x] `BookingForm` — Formspree (`xwvwdqvp`) + `doctorId` pre-fill
- [x] `DoctorCard` — locale-aware Book button
- [x] 5 mock doctors in `lib/doctors.ts`
- [x] White-page bug fixed — root layout owns `<html>`/`<body>`
- [x] Build: 18 static pages (en + vi × 5), 0 errors
- [x] `NEXT_PUBLIC_FORMSPREE_ID` configured in `.env.local`
- [ ] **Next** → Test booking form end-to-end (submit → receive email)
- [ ] **Next** → Deploy to Vercel

### Phase 2 — Database & Patient Portal ⏳ Month 1–2
- [ ] MongoDB Atlas cluster + connection test
- [ ] Patient register / login / logout API routes
- [ ] JWT session middleware for `/portal/*`
- [ ] Login + Register pages
- [ ] Appointments API (`POST`, `GET`, `DELETE`)
- [ ] Patient portal dashboard, profile, history
- [ ] BookingForm → `POST /api/appointments` (replace Formspree)
- [ ] Resend email — bilingual booking confirmation
- [ ] Zod input validation on all API routes
- [ ] Rate limiting on `/api/auth/login`

### Phase 3 — Advanced Features ⏳ Month 3–4
- [ ] Contentful CMS — doctor profiles + blog
- [ ] ISR on doctor pages (`revalidate: 3600`)
- [ ] WebRTC video consultation room
- [ ] Vercel Analytics
- [ ] Sitemap, robots.txt, `generateMetadata()` on all pages
- [ ] Lighthouse score ≥ 90

---

## Deployment

Pushes to `main` auto-deploy to Vercel via GitHub Actions.

**Vercel env vars to add:**

| Variable | Phase | Value |
|----------|-------|-------|
| `NEXT_PUBLIC_APP_URL` | 1 | `https://your-project.vercel.app` |
| `NEXT_PUBLIC_FORMSPREE_ID` | 1 | `xwvwdqvp` |
| `MONGODB_URI` | 2 | MongoDB Atlas connection string |
| `JWT_SECRET` | 2 | `openssl rand -base64 32` |
| `RESEND_API_KEY` | 2 | From resend.com |

---

## Known Architecture Note

Next.js App Router **requires** `<html>` and `<body>` in the root layout (`app/layout.tsx`).
The `[locale]` layout must **not** repeat them — it wraps content with `NextIntlClientProvider`, `Header`, and `Footer` only.

---

## Security

- JWT in HttpOnly, Secure, SameSite=Strict cookies — never localStorage (Phase 2)
- bcrypt passwords (min 10 rounds) — `passwordHash` never returned in responses
- All secrets in env vars — never hardcoded
- HTTPS via Vercel
- Zod validation on all API bodies (Phase 2)
- `CODEOWNERS` — only `@TanQHoang` can merge

---

## Contributing

**Single contributor: TanQHoang.** `CODEOWNERS` enforces this.

---

## License

Private project — all rights reserved.
