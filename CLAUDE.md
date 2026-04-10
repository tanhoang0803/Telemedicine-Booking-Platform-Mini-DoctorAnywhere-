# CLAUDE.md — Telemedicine Booking Platform (Mini-DoctorAnywhere)

**Prepared by:** TanQHoang (hoangquoctan.1996@gmail.com)
**Date:** April 10, 2026

---

## Project Overview

A free, bilingual (Vietnamese/English) telemedicine platform enabling patients to browse doctors, book appointments, and manage consultations securely.

---

## Architecture

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | Next.js 14, Tailwind CSS, i18n (vi/en)          |
| Backend    | Next.js API Routes, JWT, bcrypt                 |
| Database   | MongoDB Atlas Free Tier                         |
| Email      | Resend                                          |
| Forms      | Formspree                                       |
| CMS        | Contentful (Phase 3)                            |
| Video      | WebRTC (Phase 3)                                |
| Hosting    | Vercel Free Tier                                |

---

## Contributor Policy

**Sole contributor:** TanQHoang  
Only TanQHoang may commit, approve PRs, and trigger deployments. CODEOWNERS enforces this.

---

## Development Commands

| Command           | Description                            |
|-------------------|----------------------------------------|
| `npm run dev`     | Start development server (port 3000)   |
| `npm run build`   | Production build                       |
| `npm run lint`    | Run ESLint                             |
| `npm run test`    | Run test suite                         |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. Never commit `.env.local`.

```
MONGODB_URI=
JWT_SECRET=
RESEND_API_KEY=
FORMSPREE_ID=
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
NEXT_PUBLIC_APP_URL=
```

---

## Directory Structure

```
telemedicine-booking/
├── CLAUDE.md                     # This file — AI assistant context
├── README.md                     # Project documentation
├── .claude/
│   ├── commands/                 # Claude slash commands
│   ├── skills/                   # Domain-specific AI skills
│   ├── agents/                   # Autonomous agent configs
│   └── hooks/                    # Pre/post action hooks
├── .env.example                  # Environment variable template
├── .gitignore
├── .github/
│   ├── workflows/deploy.yml      # CI/CD pipeline
│   └── CODEOWNERS                # Restrict commits to TanQHoang
├── app/                          # Next.js App Router pages
├── components/                   # Reusable React components
├── lib/                          # Shared utilities (db, auth)
├── locales/                      # i18n translation files
└── public/images/                # Static assets
```

---

## Roadmap

| Phase   | Timeline   | Deliverables                                              |
|---------|------------|-----------------------------------------------------------|
| Phase 1 | Weeks 1–2  | Static doctor list, booking form via Formspree            |
| Phase 2 | Month 1–2  | MongoDB integration, patient portal, email notifications  |
| Phase 3 | Month 3–4  | Video consultations (WebRTC), Contentful CMS, analytics   |

---

## Security Practices

- JWT tokens for authentication; never store in localStorage (use HttpOnly cookies)
- bcrypt for password hashing (min 10 salt rounds)
- All secrets via environment variables — never hardcoded
- HTTPS enforced via Vercel
- Input validation on all API routes

---

## Risks & Mitigation

| Risk                          | Mitigation                                      |
|-------------------------------|-------------------------------------------------|
| Free tier limits exceeded     | Monitor usage; upgrade tier if needed           |
| Security vulnerabilities      | JWT, bcrypt, HTTPS, env vars enforced           |
| Single contributor bottleneck | Thorough documentation for future scaling       |
| WebRTC complexity             | Start simple, expand after Phase 2 is stable    |

---

## .claude Directory Guide

- **commands/** — Custom `/memory`, `/review`, `/deploy` slash commands
- **skills/** — Booking, portal, CMS domain knowledge for AI assistance
- **agents/** — Autonomous agents for booking, notifications, CMS workflows
- **hooks/** — `preCommit` validation, `postDeploy` verification

---

## Claude Behavior Guidelines

- Always validate environment variables exist before using them in API routes
- Prefer server-side data fetching with Next.js App Router patterns
- Use Tailwind utility classes; avoid inline styles
- All user-facing strings must have both `vi.json` and `en.json` entries
- Never suggest committing secrets or bypassing the CODEOWNERS restriction
- Follow the roadmap phases — do not introduce Phase 3 features during Phase 1/2
