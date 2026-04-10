Complete TO-DO List — Telemedicine Booking Platform                                                 
                  
  ---
  PHASE 0 — Project Foundation (Do This First — Blocker)

  The app cannot start without these.

  - 0.1 Run npx create-next-app@14 scaffold OR manually create package.json, next.config.ts,
  tsconfig.json, tailwind.config.ts, postcss.config.js
  - 0.2 Create app/layout.tsx — root layout (wraps all pages with <Header> + <Footer>, loads global
  CSS)
  - 0.3 Create app/globals.css — Tailwind directives (@tailwind base/components/utilities)
  - 0.4 Create .gitattributes — normalize LF line endings for cross-platform (Windows dev → Linux
  Vercel)
  - 0.5 Verify npm run dev starts on localhost:3000 with no errors
  - 0.6 Add public/images/doctor-placeholder.png — placeholder avatar used by DoctorCard
  - 0.7 Copy .env.example → .env.local, fill NEXT_PUBLIC_APP_URL=http://localhost:3000

  ---
  PHASE 1 — Static MVP (Weeks 1–2)

  Deployable, no database, all free.

  i18n (Bilingual Support)
  - 1.1 Install next-intl → npm install next-intl
  - 1.2 Create i18n.ts + middleware.ts — configure vi/en locale routing
  - 1.3 Wrap app in NextIntlClientProvider inside app/layout.tsx
  - 1.4 Replace all hardcoded English strings in components with useTranslations() hook
  - 1.5 Make the language switcher in Header.tsx functional (toggle vi ↔ en)
  - 1.6 Test all pages render correctly in both languages

  Booking Form (Formspree)
  - 1.7 Create Formspree account → get Form ID → set NEXT_PUBLIC_FORMSPREE_ID in .env.local
  - 1.8 Test BookingForm.tsx end-to-end: submit → receive email confirmation
  - 1.9 Add BookingCalendar into the booking page alongside BookingForm
  - 1.10 Pass doctorId from /doctors → /booking?doctorId= query param → pre-fill form

  Doctor Directory
  - 1.11 Add 3–5 realistic mock doctors to app/doctors/page.tsx (names, specialties, bios, photos)
  - 1.12 Add individual doctor detail page app/doctors/[slug]/page.tsx
  - 1.13 Wire DoctorCard "Book" button → /booking?doctorId={id}

  Layout & UI Polish
  - 1.14 Add app/not-found.tsx — custom 404 page
  - 1.15 Add app/loading.tsx — loading skeleton UI
  - 1.16 Verify fully responsive on mobile (375px), tablet (768px), desktop (1280px)
  - 1.17 Add favicon and app/icon.tsx or public/favicon.ico

  Deployment
  - 1.18 Connect GitHub repo to Vercel → import project
  - 1.19 Add all NEXT_PUBLIC_* env vars in Vercel dashboard
  - 1.20 Push to main → CI/CD auto-deploys → run /deploy checklist
  - 1.21 Add NEXT_PUBLIC_APP_URL=https://your-project.vercel.app in Vercel env vars

  ---
  PHASE 2 — Database & Patient Portal (Month 1–2)

  Real backend, authentication, email notifications.

  Infrastructure Setup
  - 2.1 Create MongoDB Atlas free cluster → get MONGODB_URI → add to .env.local + Vercel
  - 2.2 Install packages: npm install mongodb bcryptjs jose zod resend
  - 2.3 Install types: npm install -D @types/bcryptjs
  - 2.4 Test lib/db.ts connection with a simple health-check API route

  API Health Route
  - 2.5 Create app/api/health/route.ts → returns { status: "ok", db: "connected" }

  Authentication
  - 2.6 Create app/api/auth/register/route.ts — hash password with bcrypt, store patient, return JWT
  cookie
  - 2.7 Create app/api/auth/login/route.ts — verify password, set HttpOnly JWT cookie
  - 2.8 Create app/api/auth/logout/route.ts — clear JWT cookie
  - 2.9 Create middleware.ts — protect /portal/* routes, redirect to /login if no valid session
  - 2.10 Create app/login/page.tsx + app/register/page.tsx with forms
  - 2.11 Add i18n keys for all auth strings in vi.json + en.json
  - 2.12 Test full register → login → logout cycle

  Appointments API
  - 2.13 Create app/api/appointments/route.ts:
    - POST — create appointment (auth required, validate with Zod)
    - GET — list patient's appointments (auth required)
  - 2.14 Create app/api/appointments/[id]/route.ts:
    - DELETE — cancel appointment (auth required, own appointments only)
  - 2.15 Add server-side validation: future dates only, no duplicate doctor+date bookings
  - 2.16 Migrate BookingForm from Formspree → POST /api/appointments (behind auth)

  Doctors API
  - 2.17 Create app/api/doctors/route.ts — GET returns doctor list from MongoDB
  - 2.18 Seed MongoDB with mock doctor data (create scripts/seed.ts)
  - 2.19 Update app/doctors/page.tsx to fetch from API instead of hardcoded mock array

  Patient Portal
  - 2.20 Build out app/portal/page.tsx — dashboard with upcoming/past appointments
  - 2.21 Create app/portal/profile/page.tsx — edit name, phone, language preference
  - 2.22 Create app/portal/history/page.tsx — full appointment history with status badges
  - 2.23 Add cancel appointment button (calls DELETE /api/appointments/[id])

  Email Notifications (Resend)
  - 2.24 Create Resend account → get API key → add to .env.local + Vercel
  - 2.25 Create lib/email.ts with sendBookingConfirmation() function
  - 2.26 Create bilingual email templates (inline HTML, vi + en)
  - 2.27 Call sendBookingConfirmation() inside appointment POST route (async, non-blocking)
  - 2.28 Test email received in both languages

  Security Hardening
  - 2.29 Add rate limiting to /api/auth/login (e.g., npm install @upstash/ratelimit on Vercel free KV,
   or simple in-memory limiter)
  - 2.30 Add Zod validation schemas for all API request bodies
  - 2.31 Ensure no passwordHash field ever appears in any API response
  - 2.32 Verify all /api/* routes requiring auth return 401 without a valid session

  Testing
  - 2.33 Install npm install -D jest @testing-library/react @testing-library/jest-dom
  - 2.34 Write unit tests for Zod schemas and auth utilities
  - 2.35 Write integration tests for the booking flow

  ---
  PHASE 3 — Advanced Features (Month 3–4)

  Video, CMS, analytics, SEO.

  Contentful CMS
  - 3.1 Create Contentful space, configure vi/en locales
  - 3.2 Define doctor and article content types (per .claude/skills/cms.md)
  - 3.3 Install npm install contentful
  - 3.4 Create lib/contentful.ts client
  - 3.5 Migrate doctor pages to fetch from Contentful with ISR (revalidate: 3600)
  - 3.6 Build a blog/news section app/blog/page.tsx powered by Contentful articles

  Video Consultations (WebRTC)
  - 3.7 Research free WebRTC signaling option (e.g., PeerJS, Daily.co free tier)
  - 3.8 Create app/consultation/[appointmentId]/page.tsx — video room
  - 3.9 Add "Start Consultation" button in portal (only for confirmed appointments)
  - 3.10 Implement basic video + audio with mute/end controls

  Analytics & SEO
  - 3.11 Add Vercel Analytics → npm install @vercel/analytics → add <Analytics /> to layout
  - 3.12 Add app/sitemap.ts — auto-generates sitemap for all doctor pages
  - 3.13 Add app/robots.ts — search engine crawl rules
  - 3.14 Add generateMetadata() to all pages (title, description, og:image)
  - 3.15 Add structured data (JSON-LD) to doctor profile pages for Google

  Performance
  - 3.16 Run Lighthouse audit → fix any score below 90
  - 3.17 Add next/image optimization to all doctor photos
  - 3.18 Enable Vercel Edge caching for doctor list pages

  ---
  ONGOING — Every Phase

  - Keep vi.json and en.json keys in sync after every UI change
  - Update NEXT_PUBLIC_ENABLE_AUTH / NEXT_PUBLIC_ENABLE_CMS feature flags in .env as phases complete
  - Update CLAUDE_PHASE in .claude/settings.json when advancing phases
  - Run /review before every commit, /deploy before every production push
  - Update README.md checklist as milestones are completed