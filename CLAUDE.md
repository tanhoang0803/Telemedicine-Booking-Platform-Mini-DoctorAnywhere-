# CLAUDE.md — Telemedicine Booking Platform (Mini-DoctorAnywhere)

**Prepared by:** TanQHoang (hoangquoctan.1996@gmail.com)
**Started:** April 10, 2026
**Last updated:** April 10, 2026
**Current phase:** Phase 1 complete

---

## Project Overview

A free, bilingual (Vietnamese/English) telemedicine platform enabling patients to browse doctors, book appointments, and manage consultations securely. Built on the Next.js 14 App Router with next-intl v4 for locale routing.

---

## Current State (as of Phase 1)

| Area | Status | Notes |
|------|--------|-------|
| Project foundation | ✅ Done | package.json, tsconfig, tailwind, eslint, gitattributes |
| i18n (next-intl v4) | ✅ Done | `/en/...` and `/vi/...` routes, live switcher |
| Static pages | ✅ Done | Home, Doctors, Booking, Portal, Contact |
| BookingForm (Formspree) | ✅ Done | Needs `NEXT_PUBLIC_FORMSPREE_ID` set to go live |
| MongoDB / Auth | ⏳ Phase 2 | `lib/db.ts` and `lib/auth.ts` scaffolded, not wired |
| Email (Resend) | ⏳ Phase 2 | — |
| Contentful CMS | ⏳ Phase 3 | — |
| WebRTC video | ⏳ Phase 3 | — |

---

## Architecture

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Framework  | Next.js 14.2 (App Router, SSG)                          |
| Styling    | Tailwind CSS 3.4                                        |
| i18n       | next-intl 4.9 — locale routing, `NextIntlClientProvider` |
| Forms      | Formspree (Phase 1)                                     |
| Auth       | JWT via `jose`, bcrypt (Phase 2)                        |
| Database   | MongoDB Atlas Free Tier (Phase 2)                       |
| Email      | Resend (Phase 2)                                        |
| CMS        | Contentful (Phase 3)                                    |
| Video      | WebRTC (Phase 3)                                        |
| Hosting    | Vercel Free Tier                                        |

---

## Contributor Policy

**Sole contributor:** TanQHoang
Only TanQHoang may commit, approve PRs, and trigger deployments. Enforced via `.github/CODEOWNERS`.

---

## Development Commands

| Command          | Description                                 |
|------------------|---------------------------------------------|
| `npm run dev`    | Start dev server → http://localhost:3000    |
| `npm run build`  | Production build (must pass before pushing) |
| `npm run lint`   | Run ESLint (must pass before committing)    |
| `npm run start`  | Serve the production build locally          |

---

## Environment Variables

Copy `.env.example` → `.env.local`. Never commit `.env.local`.

```
# Phase 1 (required now)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FORMSPREE_ID=                  # formspree.io → create form → copy ID

# Phase 2 (add when starting Phase 2)
MONGODB_URI=
JWT_SECRET=                                # openssl rand -base64 32
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Phase 3 (add when starting Phase 3)
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_PREVIEW_TOKEN=

# Feature flags
NEXT_PUBLIC_ENABLE_AUTH=false
NEXT_PUBLIC_ENABLE_CMS=false
NEXT_PUBLIC_ENABLE_VIDEO=false
```

---

## Directory Structure

```
telemedicine-booking/
├── CLAUDE.md                         # This file — AI context
├── README.md                         # User-facing documentation
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
├── middleware.ts                     # next-intl middleware — locale detection + redirect
├── app/
│   ├── layout.tsx                    # Root layout — returns children (html/body in [locale])
│   ├── globals.css                   # Tailwind directives
│   ├── [locale]/                     # All user-facing routes
│   │   ├── layout.tsx                # html lang, Inter font, Provider, Header/Footer
│   │   ├── page.tsx                  # Home
│   │   ├── booking/page.tsx          # Booking form (reads ?doctorId from searchParams)
│   │   ├── doctors/page.tsx          # Doctor directory (MOCK_DOCTORS from lib/doctors.ts)
│   │   ├── portal/page.tsx           # Patient portal (Phase 2 placeholder)
│   │   ├── contact/page.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   └── {booking,doctors,portal,contact}/page.tsx  # Redirect → /en/* fallbacks
├── components/
│   ├── layout/Header.tsx             # 'use client' — useTranslations + locale switcher
│   ├── layout/Footer.tsx             # Locale-aware links
│   ├── booking/BookingForm.tsx       # 'use client' — Formspree + useTranslations + doctorId
│   ├── booking/BookingCalendar.tsx   # 'use client' — date picker (Phase 2: full availability)
│   └── doctors/DoctorCard.tsx        # 'use client' — locale-aware Book link
├── lib/
│   ├── doctors.ts                    # Doctor type + MOCK_DOCTORS (5 entries)
│   ├── db.ts                         # MongoDB cached connection (Phase 2)
│   └── auth.ts                       # JWT sign/verify/session (Phase 2)
├── locales/
│   ├── en.json                       # English translations
│   └── vi.json                       # Vietnamese translations (keys must stay in sync)
└── public/images/
    └── doctor-placeholder.svg
```

---

## i18n Conventions (next-intl v4)

**Server components** — use `getTranslations`:
```ts
import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)                       // enables static rendering
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

**Locale-aware navigation** — always use `@/i18n/navigation`, not `next/link`:
```ts
import { Link, useRouter, usePathname } from '@/i18n/navigation'
```

**Translation key rule:** Every key added to `en.json` must also be added to `vi.json` — the post-edit hook in `.claude/settings.json` warns when they drift.

---

## Roadmap

| Phase   | Timeline   | Status | Key Deliverables |
|---------|------------|--------|------------------|
| Phase 0 | Apr 10     | ✅ Done | Foundation, build passing |
| Phase 1 | Weeks 1–2  | ✅ Done | i18n, static pages, Formspree booking |
| Phase 2 | Month 1–2  | ⏳ Next | MongoDB, JWT auth, patient portal, Resend |
| Phase 3 | Month 3–4  | ⏳ Future | WebRTC, Contentful, analytics, SEO |

---

## Security Practices

- JWT tokens stored in HttpOnly, Secure, SameSite=Strict cookies — never localStorage
- bcrypt password hashing (min 10 salt rounds) — never return `passwordHash` in responses
- All secrets via environment variables — never hardcoded
- HTTPS enforced via Vercel
- Zod validation on all API request bodies (Phase 2)
- Rate limit `/api/auth/login` (Phase 2)

---

## Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Free tier limits exceeded | Monitor Vercel/MongoDB/Resend dashboards; upgrade if needed |
| Security vulnerabilities | JWT, bcrypt, HTTPS, env vars strictly enforced |
| Single contributor bottleneck | Thorough docs in CLAUDE.md, README, `.claude/` directory |
| WebRTC complexity | Start with free tier (PeerJS/Daily.co), expand post-Phase 2 |

---

## .claude Directory Guide

| Path | Purpose |
|------|---------|
| `commands/memory.md` | `/memory` — persist key decisions across sessions |
| `commands/review.md` | `/review` — security, i18n sync, phase adherence check |
| `commands/deploy.md` | `/deploy` — pre/post deployment checklist |
| `skills/booking.md` | Booking domain: Formspree (P1) → API (P2) |
| `skills/portal.md` | Patient portal: JWT flow, schemas, protected routes |
| `skills/cms.md` | Contentful: content models, ISR, migration (P3 only) |
| `agents/bookingAgent.md` | Scaffolding for booking features |
| `agents/notificationAgent.md` | Resend email integration (P2) |
| `agents/cmsAgent.md` | Contentful migration (P3) |
| `hooks/preCommit.md` | Lint, secret scan, translation sync, env var checks |
| `hooks/postDeploy.md` | Smoke tests + manual verification |
| `settings.json` | Auto-allow safe commands; block destructive git ops; post-edit translation sync hook |

---

## Claude Behavior Guidelines

- **Phase discipline** — Do not introduce Phase 2/3 features during Phase 1. Check `CLAUDE_PHASE` in `settings.json`.
- **Translations** — Every UI string must have both `en.json` and `vi.json` keys. Run `/review` to verify sync.
- **Navigation** — Always use `Link`/`useRouter` from `@/i18n/navigation`, never `next/link` directly.
- **Server vs client** — Use `getTranslations` in server components, `useTranslations` in client components. Add `'use client'` when using hooks or event handlers.
- **`setRequestLocale`** — Call in every `[locale]` page and layout for static rendering.
- **params in Next.js 14.2** — `params` is a `Promise<{ locale: string }>`, always `await params`.
- **Secrets** — Never hardcode. Any new `process.env.VAR` must also appear in `.env.example`.
- **Data** — Doctor data lives in `lib/doctors.ts`. Do not export non-Next.js values from page files.
- **Styling** — Tailwind utility classes only; no inline styles.
- **Commits** — `npm run build` must pass. Never use `--no-verify`. Follow conventional commits (`feat:`, `fix:`, `chore:`).
