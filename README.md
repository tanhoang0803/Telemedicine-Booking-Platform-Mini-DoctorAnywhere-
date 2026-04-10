# Telemedicine Booking Platform (Mini-DoctorAnywhere)

A free, bilingual (Vietnamese/English) telemedicine platform that enables patients to browse doctors, book appointments, and manage consultations securely.

**Author:** TanQHoang (hoangquoctan.1996@gmail.com)
**Started:** April 10, 2026

---

## Features

- **Doctor Directory** — Browse doctor profiles with specialties, availability, and ratings
- **Appointment Booking** — Book consultations via an integrated booking form
- **Patient Portal** — Manage appointments, view history, update profile
- **Bilingual Support** — Full Vietnamese and English interface
- **Email Notifications** — Booking confirmations sent via Resend
- **Secure Auth** — JWT authentication with bcrypt password hashing

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | Next.js 14, Tailwind CSS                |
| Backend  | Next.js API Routes                      |
| Auth     | JWT + bcrypt                            |
| Database | MongoDB Atlas (Free Tier)               |
| Email    | Resend                                  |
| Forms    | Formspree                               |
| CMS      | Contentful *(Phase 3)*                  |
| Video    | WebRTC *(Phase 3)*                      |
| Hosting  | Vercel (Free Tier)                      |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier)
- Vercel account (free tier)

### Installation

```bash
git clone https://github.com/TanQHoang/telemedicine-booking.git
cd telemedicine-booking
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/telemedicine
JWT_SECRET=your-secure-random-secret
RESEND_API_KEY=re_xxxxxxxxxxxx
FORMSPREE_ID=your-formspree-form-id
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-access-token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
telemedicine-booking/
├── app/
│   ├── page.tsx              # Home page
│   ├── booking/page.tsx      # Appointment booking
│   ├── doctors/page.tsx      # Doctor directory
│   ├── portal/page.tsx       # Patient portal
│   └── contact/page.tsx      # Contact page
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   └── BookingCalendar.tsx
│   └── doctors/
│       └── DoctorCard.tsx
├── lib/
│   ├── db.ts                 # MongoDB connection
│   └── auth.ts               # JWT utilities
├── locales/
│   ├── en.json               # English translations
│   └── vi.json               # Vietnamese translations
└── public/images/            # Static assets
```

---

## Roadmap

### Phase 1 — Weeks 1–2 (Static MVP)
- [x] Project setup, CLAUDE.md, README.md
- [ ] Static doctor list with mock data
- [ ] Booking form integrated with Formspree
- [ ] Responsive UI with Tailwind CSS
- [ ] Basic bilingual support (vi/en)

### Phase 2 — Month 1–2 (Database & Portal)
- [ ] MongoDB Atlas integration
- [ ] JWT authentication + patient registration/login
- [ ] Patient portal (appointments, profile)
- [ ] Email notifications via Resend
- [ ] API routes for doctors, appointments

### Phase 3 — Month 3–4 (Advanced Features)
- [ ] Video consultations via WebRTC
- [ ] CMS integration with Contentful
- [ ] Analytics dashboard
- [ ] SEO optimization
- [ ] Performance monitoring

---

## Deployment

Deployed automatically to Vercel on push to `main`:

1. Connect repo to Vercel
2. Add environment variables in Vercel dashboard
3. Push to `main` — CI/CD handles the rest

---

## Security

- JWT tokens stored in HttpOnly cookies
- Passwords hashed with bcrypt (10+ rounds)
- All secrets in environment variables
- HTTPS enforced via Vercel
- Input validation on all API endpoints

---

## Contributing

**This project has a single contributor: TanQHoang.**

The `CODEOWNERS` file restricts all commits and PR approvals to the project owner. External contributions are not accepted at this stage.

---

## License

Private project — all rights reserved. Not open source.
