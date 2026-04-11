# CLAUDE.md — Telemedicine Booking Platform (Mini-DoctorAnywhere)

**Prepared by:** TanQHoang (hoangquoctan.1996@gmail.com)
**Started:** April 10, 2026
**Last updated:** April 11, 2026
**Current phase:** Phase 2 complete — live on Vercel with MongoDB, JWT auth, patient portal

---

## Project Overview

A free, bilingual (Vietnamese/English) telemedicine platform enabling patients to browse doctors, book appointments, and manage consultations securely. Built on Next.js 14 App Router with next-intl v4 for locale-based routing.

---

## Current State

| Area | Status | Notes |
|------|--------|-------|
| Project foundation | ✅ Done | package.json, tsconfig, tailwind, eslint, gitattributes |
| i18n (next-intl v4) | ✅ Done | `/en/...` + `/vi/...` routes, live EN/VI switcher |
| Static pages | ✅ Done | Home, Doctors, Booking, Portal, Contact — all bilingual |
| Vercel deployment | ✅ Live | https://telemedicine-booking-platform-mini.vercel.app/en |
| MongoDB Atlas | ✅ Connected | cluster0.gi0tvbq.mongodb.net / db: telemedicine |
| JWT Auth | ✅ Done | register, login, logout, /me — HttpOnly session cookies |
| Patient portal | ✅ Done | Dashboard with stats, appointments list, cancel |
| Appointments API | ✅ Done | POST, GET, DELETE — auth-gated |
| Resend email | ✅ Configured | Bilingual booking confirmation, fire-and-forget |
| Zod validation | ✅ Done | All API request bodies validated |
| Route protection | ✅ Done | middleware.ts guards /portal with JWT check |
| Toast notifications | ✅ Done | Sign-in success toast |
| Doctor pre-fill | ✅ Done | Booking form auto-fills name & specialty from doctor card |
| Rate limiting | ⏳ Phase 3 | Add to /api/auth/login |
| Contentful CMS | ⏳ Phase 3 | — |
| WebRTC video | ⏳ Phase 3 | — |

---

## Architecture

| Layer      | Technology                                               |
|------------|----------------------------------------------------------|
| Framework  | Next.js 14.2 (App Router, SSG)                           |
| Styling    | Tailwind CSS 3.4                                         |
| i18n       | next-intl 4.9 — locale routing, `NextIntlClientProvider` |
| Forms      | Formspree (Phase 1)                                      |
| Auth       | JWT via `jose`, bcrypt (Phase 2)                         |
| Database   | MongoDB Atlas Free Tier (Phase 2)                        |
| Email      | Resend (Phase 2)                                         |
| CMS        | Contentful (Phase 3)                                     |
| Video      | WebRTC (Phase 3)                                         |
| Hosting    | Vercel Free Tier                                         |

---

## Contributor Policy

**Sole contributor:** TanQHoang
Only TanQHoang may commit, approve PRs, and trigger deployments. Enforced via `.github/CODEOWNERS`.

---

## Development Commands

| Command          | Description                                  |
|------------------|----------------------------------------------|
| `npm run dev`    | Start dev server → http://localhost:3000     |
| `npm run build`  | Production build (must pass before pushing)  |
| `npm run lint`   | Run ESLint (must pass before committing)     |
| `npm run start`  | Serve the production build locally           |

---

## Environment Variables

Copy `.env.example` → `.env.local`. Never commit `.env.local`.

```
# Phase 1 — required
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FORMSPREE_ID=xwvwdqvp          # ✅ configured

# Phase 2 — add when starting Phase 2
MONGODB_URI=
JWT_SECRET=                                 # openssl rand -base64 32
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Phase 3 — add when starting Phase 3
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_PREVIEW_TOKEN=

# Feature flags
NEXT_PUBLIC_ENABLE_AUTH=false
NEXT_PUBLIC_ENABLE_CMS=false
NEXT_PUBLIC_ENABLE_VIDEO=false
```

---

## Critical Layout Rule — Do Not Break

Next.js App Router **requires** `<html>` and `<body>` in the root layout only.

```
app/layout.tsx          ← owns <html suppressHydrationWarning>, <body>, Inter font, metadata
app/[locale]/layout.tsx ← wrapper only: NextIntlClientProvider + Header + Footer
                           NO <html>, NO <body> here — causes white page if added
```

This was a production bug. Never add `<html>`/`<body>` to the locale layout again.

---

## Directory Structure

```
telemedicine-booking/
├── CLAUDE.md
├── README.md
├── .claude/
│   ├── commands/                     # /memory, /review, /deploy
│   ├── skills/                       # booking.md, portal.md, cms.md
│   ├── agents/                       # bookingAgent, notificationAgent, cmsAgent
│   ├── hooks/                        # preCommit.md, postDeploy.md
│   └── settings.json                 # Permissions + pre/post-tool hooks
├── i18n/
│   ├── routing.ts                    # defineRouting({ locales: ['en','vi'] })
│   ├── request.ts                    # getRequestConfig — loads locales/*.json
│   └── navigation.ts                 # createNavigation — locale-aware Link/useRouter
├── middleware.ts                     # next-intl locale detection + redirect
├── app/
│   ├── layout.tsx                    # ROOT — <html>, <body>, Inter font, metadata ← CRITICAL
│   ├── globals.css                   # Tailwind directives
│   ├── [locale]/
│   │   ├── layout.tsx                # Provider + Header + Footer (no html/body)
│   │   ├── page.tsx                  # Home
│   │   ├── booking/page.tsx          # Booking form (reads ?doctorId from searchParams)
│   │   ├── doctors/page.tsx          # Doctor directory (MOCK_DOCTORS from lib/doctors.ts)
│   │   ├── portal/page.tsx           # Patient portal (Phase 2 placeholder)
│   │   ├── contact/page.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   └── {booking,doctors,portal,contact}/page.tsx  # redirect → /en/* fallbacks
├── components/
│   ├── auth/LoginForm.tsx            # 'use client' — login + toast on success
│   ├── auth/RegisterForm.tsx         # 'use client' — register form
│   ├── auth/UserContext.tsx          # 'use client' — global user state, useUser()
│   ├── layout/Header.tsx             # 'use client' — auth-aware nav + logout
│   ├── layout/Footer.tsx             # Locale-aware links
│   ├── booking/BookingForm.tsx       # 'use client' — API-backed, auth-gated, pre-fill
│   ├── doctors/DoctorCard.tsx        # 'use client' — passes doctorName+specialty in URL
│   ├── portal/AppointmentDashboard.tsx # 'use client' — live stats + appointment cards
│   └── ui/Toast.tsx                  # 'use client' — slide-up notification
├── lib/
│   ├── doctors.ts                    # Doctor type + MOCK_DOCTORS (5 entries)
│   ├── db.ts                         # MongoDB lazy-init connection
│   ├── auth.ts                       # JWT sign/verify/session + sessionCookieOptions
│   ├── schemas.ts                    # Zod: RegisterSchema, LoginSchema, AppointmentSchema
│   └── email.ts                      # Resend bilingual booking confirmation
├── locales/
│   ├── en.json                       # English translations
│   └── vi.json                       # Vietnamese translations (must stay in sync with en.json)
└── public/images/
    └── doctor-placeholder.svg
```

---

## i18n Conventions (next-intl v4)

**Server components** — use `getTranslations` + `setRequestLocale`:
```ts
import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)                 // required for static rendering
  const t = await getTranslations('namespace')
  return <h1>{t('key')}</h1>
}
```

**Client components** — use `useTranslations`:
```ts
'use client'
import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('namespace')
  return <p>{t('key')}</p>
}
```

**Locale-aware navigation** — always `@/i18n/navigation`, never `next/link`:
```ts
import { Link, useRouter, usePathname } from '@/i18n/navigation'
```

**Locale switcher pattern:**
```ts
const router = useRouter()
const pathname = usePathname()
router.replace(pathname, { locale: 'vi' })   // stays on same page, switches language
```

**Translation key rule:** Every key in `en.json` must exist in `vi.json`. The post-edit hook in `.claude/settings.json` warns on drift.

---

## Page File Rule

Next.js page files may only export:
- `default` (the page component)
- `generateStaticParams`, `generateMetadata`, `config`, etc. (Next.js reserved)

**Never export data or types from page files.** Put shared data in `lib/`:
```
✅ lib/doctors.ts  → export const MOCK_DOCTORS, export type Doctor
❌ app/[locale]/doctors/page.tsx  → export const MOCK_DOCTORS  (build error)
```

---

## Roadmap

| Phase   | Timeline   | Status            | Key Deliverables |
|---------|------------|-------------------|------------------|
| Phase 0 | Apr 10     | ✅ Done            | Foundation, build passing |
| Phase 1 | Apr 10     | ✅ Done            | i18n, static pages, Formspree, Vercel deploy |
| Phase 2 | Apr 11     | ✅ Done            | MongoDB, JWT auth, patient portal, Resend, toast |
| Phase 3 | Month 2+   | ⏳ Next            | Rate limiting, WebRTC, Contentful, analytics, SEO |

---

## Security Practices

- JWT tokens in HttpOnly, Secure, SameSite=Strict cookies — never localStorage
- bcrypt password hashing (min 10 rounds) — never return `passwordHash` in API responses
- All secrets in env vars — never hardcoded
- HTTPS via Vercel
- Zod validation on all API request bodies (Phase 2)
- Rate limit `/api/auth/login` (Phase 2)

---

## Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Free tier limits | Monitor Vercel/MongoDB/Resend; upgrade if needed |
| Security vulnerabilities | JWT, bcrypt, HTTPS, env vars enforced |
| Single contributor bottleneck | Thorough docs in CLAUDE.md, README, `.claude/` |
| WebRTC complexity | Start with PeerJS/Daily.co free tier, expand post-Phase 2 |

---

## .claude Directory Guide

| Path | Purpose |
|------|---------|
| `commands/memory.md` | `/memory` — persist decisions across sessions |
| `commands/review.md` | `/review` — security, i18n sync, phase adherence |
| `commands/deploy.md` | `/deploy` — pre/post deployment checklist |
| `skills/booking.md` | Booking: Formspree (P1) → API (P2) |
| `skills/portal.md` | Portal: JWT flow, schemas, protected routes |
| `skills/cms.md` | Contentful: models, ISR, migration (P3 only) |
| `agents/bookingAgent.md` | Booking feature scaffolding |
| `agents/notificationAgent.md` | Resend email (P2) |
| `agents/cmsAgent.md` | Contentful migration (P3) |
| `hooks/preCommit.md` | Lint, secret scan, translation sync, env check |
| `hooks/postDeploy.md` | Smoke tests + manual verification |
| `settings.json` | Allow safe commands; block destructive git; translation sync hook |

---

## Claude Behavior Guidelines

- **Layout rule** — Root `app/layout.tsx` owns `<html>`+`<body>`. Locale layout is wrapper only. Never add html/body to `[locale]/layout.tsx`.
- **Phase discipline** — Never introduce Phase 2/3 features in Phase 1 code.
- **Translations** — Every UI string needs both `en.json` + `vi.json` entries.
- **Navigation** — Use `@/i18n/navigation` (`Link`, `useRouter`, `usePathname`), never `next/link`.
- **Server vs client** — `getTranslations` in server components, `useTranslations` in client components. Add `'use client'` for hooks or event handlers.
- **Static rendering** — Call `setRequestLocale(locale)` in every `[locale]` page and layout.
- **params** — In Next.js 14.2, `params` is `Promise<{ locale: string }>` — always `await params`.
- **Page exports** — Only export the default component + Next.js reserved names from page files. Data goes in `lib/`.
- **Secrets** — Never hardcode. New `process.env.VAR` must appear in `.env.example`.
- **Commits** — `npm run build` must pass. Never `--no-verify`. Use `feat:` / `fix:` / `docs:` / `chore:` prefixes.
