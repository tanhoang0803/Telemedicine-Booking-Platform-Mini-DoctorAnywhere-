# Telemedicine Booking Platform (Mini-DoctorAnywhere)

A free, bilingual (Vietnamese/English) telemedicine platform that enables patients to browse doctors, book appointments, and manage consultations securely.

**Author:** TanQHoang (hoangquoctan.1996@gmail.com)
**Started:** April 10, 2026
**Current phase:** Phase 1 complete — static MVP with bilingual support

---

## Live Features (Phase 1)

- **Bilingual UI** — Full Vietnamese / English with live switcher (EN | VI) in the header
- **Doctor Directory** — 5 mock doctor profiles with specialties, availability, ratings, and language badges
- **Appointment Booking** — Form with Formspree integration; pre-fills doctor when coming from directory
- **Locale Routing** — All pages available at `/en/...` and `/vi/...`; middleware auto-detects and redirects
- **Responsive Layout** — Mobile-first with collapsible navigation

---

## Tech Stack

| Layer      | Technology                                          | Status       |
|------------|-----------------------------------------------------|--------------|
| Framework  | Next.js 14.2 (App Router)                           | ✅ Active     |
| Styling    | Tailwind CSS 3.4                                    | ✅ Active     |
| i18n       | next-intl 4.9 (locale routing, SSG)                 | ✅ Active     |
| Forms      | Formspree                                           | ✅ Phase 1    |
| Auth       | JWT (jose) + bcrypt                                 | ⏳ Phase 2    |
| Database   | MongoDB Atlas (Free Tier)                           | ⏳ Phase 2    |
| Email      | Resend                                              | ⏳ Phase 2    |
| CMS        | Contentful                                          | ⏳ Phase 3    |
| Video      | WebRTC                                              | ⏳ Phase 3    |
| Hosting    | Vercel (Free Tier)                                  | ✅ Active     |

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

Minimum required for Phase 1 (dev server):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FORMSPREE_ID=your-formspree-form-id   # get from formspree.io
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
├── .gitignore
├── .gitattributes                    # LF normalization
├── .github/
│   ├── workflows/deploy.yml          # Vercel CI/CD pipeline
│   └── CODEOWNERS                    # Restricts all PRs to @TanQHoang
├── i18n/
│   ├── routing.ts                    # Locale config (en, vi)
│   ├── request.ts                    # Loads locales/*.json per request
│   └── navigation.ts                 # Locale-aware Link, useRouter, usePathname
├── middleware.ts                     # next-intl locale detection + redirect
├── app/
│   ├── layout.tsx                    # Minimal root layout (html/body in [locale])
│   ├── globals.css                   # Tailwind directives + base styles
│   ├── [locale]/                     # All user-facing routes (en | vi)
│   │   ├── layout.tsx                # html lang, Inter font, Provider, Header/Footer
│   │   ├── page.tsx                  # Home
│   │   ├── booking/page.tsx          # Booking form (reads ?doctorId)
│   │   ├── doctors/page.tsx          # Doctor directory
│   │   ├── portal/page.tsx           # Patient portal
│   │   ├── contact/page.tsx          # Contact
│   │   ├── loading.tsx               # Spinner
│   │   └── not-found.tsx             # 404
│   ├── booking/page.tsx              # Redirect → /en/booking (middleware catches first)
│   ├── doctors/page.tsx              # Redirect → /en/doctors
│   ├── portal/page.tsx               # Redirect → /en/portal
│   └── contact/page.tsx              # Redirect → /en/contact
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Nav + EN/VI live switcher
│   │   └── Footer.tsx
│   ├── booking/
│   │   ├── BookingForm.tsx           # Formspree + useTranslations
│   │   └── BookingCalendar.tsx       # Date picker (Phase 2: availability calendar)
│   └── doctors/
│       └── DoctorCard.tsx            # Profile card with locale-aware Book link
├── lib/
│   ├── doctors.ts                    # Doctor type + Phase 1 mock data
│   ├── db.ts                         # MongoDB connection (Phase 2)
│   └── auth.ts                       # JWT utilities (Phase 2)
├── locales/
│   ├── en.json                       # English translations (40+ keys)
│   └── vi.json                       # Vietnamese translations (synced)
└── public/images/
    └── doctor-placeholder.svg        # Avatar placeholder
```

---

## Roadmap

### Phase 0 — Project Foundation ✅
- [x] `package.json`, `next.config.mjs`, `tsconfig.json`
- [x] `tailwind.config.ts`, `postcss.config.mjs`, `.eslintrc.json`
- [x] `app/layout.tsx`, `app/globals.css`, `app/loading.tsx`, `app/not-found.tsx`
- [x] `.gitattributes`, `.gitignore`, `.env.example`
- [x] `.claude/settings.json` — permissions + hooks
- [x] `.github/workflows/deploy.yml`, `.github/CODEOWNERS`
- [x] Build passes: `npm run build` ✓

### Phase 1 — Static MVP ✅
- [x] `next-intl` v4 — locale routing (`/en/...`, `/vi/...`)
- [x] `middleware.ts` — auto-detect and redirect to locale
- [x] `i18n/routing.ts`, `request.ts`, `navigation.ts`
- [x] `app/[locale]/layout.tsx` — `html lang`, `NextIntlClientProvider`
- [x] All 5 pages translated (home, doctors, booking, portal, contact)
- [x] Header — live EN/VI switcher stays on current path
- [x] `BookingForm` — `useTranslations` + Formspree + `doctorId` pre-fill
- [x] `DoctorCard` — locale-aware Book button
- [x] 5 mock doctors in `lib/doctors.ts`
- [x] `doctor-placeholder.svg`
- [x] Build: 18 static pages (en + vi × 5), 0 errors
- [ ] **1.7** Set `NEXT_PUBLIC_FORMSPREE_ID` and test booking email end-to-end
- [ ] **1.8** Deploy to Vercel — connect repo, add env vars, verify live site

### Phase 2 — Database & Patient Portal ⏳ Month 1–2
- [ ] MongoDB Atlas cluster + `lib/db.ts` connection verified
- [ ] Patient register / login / logout API routes
- [ ] JWT middleware protecting `/portal/*`
- [ ] `app/[locale]/login/page.tsx`, `app/[locale]/register/page.tsx`
- [ ] Appointments API (`POST`, `GET`, `DELETE`)
- [ ] Patient portal — dashboard, profile, history
- [ ] Replace `BookingForm` Formspree → `POST /api/appointments`
- [ ] Resend email — booking confirmation (bilingual)
- [ ] Zod validation on all API request bodies
- [ ] Rate limiting on login endpoint

### Phase 3 — Advanced Features ⏳ Month 3–4
- [ ] Contentful CMS — doctor profiles + blog articles
- [ ] ISR on doctor pages (`revalidate: 3600`)
- [ ] WebRTC video consultation room
- [ ] Vercel Analytics
- [ ] `app/sitemap.ts`, `app/robots.ts`
- [ ] `generateMetadata()` on all pages (SEO)
- [ ] Lighthouse score ≥ 90

---

## Deployment

CI/CD via GitHub Actions + Vercel. Pushes to `main` auto-deploy to production.

**Required secrets in Vercel dashboard:**

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_FORMSPREE_ID
MONGODB_URI          (Phase 2)
JWT_SECRET           (Phase 2)
RESEND_API_KEY       (Phase 2)
```

---

## Security

- JWT tokens stored in HttpOnly, Secure, SameSite=Strict cookies (Phase 2)
- Passwords hashed with bcrypt (min 10 rounds)
- All secrets in environment variables — never hardcoded
- HTTPS enforced via Vercel
- Input validated with Zod on all API endpoints (Phase 2)
- `CODEOWNERS` — only `@TanQHoang` can merge PRs

---

## Contributing

**Single contributor: TanQHoang.** The `CODEOWNERS` file enforces this.
External contributions are not accepted.

---

## License

Private project — all rights reserved. Not open source.
