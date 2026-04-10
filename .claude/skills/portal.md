# Skill: Patient Portal

Domain knowledge for the patient portal feature of the Telemedicine Booking Platform.

## Scope

Covers the authenticated patient dashboard:
- `app/portal/page.tsx`
- `app/api/auth/` routes
- `lib/auth.ts`
- Patient-related API routes

## Phase 2 Feature Set

The patient portal is a Phase 2 deliverable. It requires:
- JWT authentication (login/register)
- MongoDB patient document
- Protected Next.js routes

## Authentication Flow

```
Register → POST /api/auth/register → hash password (bcrypt) → store patient → return JWT
Login    → POST /api/auth/login    → verify password → return JWT (HttpOnly cookie)
Logout   → POST /api/auth/logout   → clear cookie
```

JWT payload:
```ts
{
  sub: patientId,        // MongoDB ObjectId
  email: string,
  name: string,
  role: 'patient',
  iat: number,
  exp: number            // 7 days
}
```

## Patient Document Schema

```ts
{
  _id: ObjectId,
  name: string,
  email: string,          // unique index
  passwordHash: string,   // bcrypt, never returned to client
  phone: string,
  dateOfBirth: Date,
  language: 'vi' | 'en',
  createdAt: Date,
  updatedAt: Date
}
```

## Portal Pages

| Route            | Description                                      |
|------------------|--------------------------------------------------|
| `/portal`        | Dashboard: upcoming/past appointments            |
| `/portal/profile`| Edit name, phone, language preference            |
| `/portal/history`| Full appointment history with status             |

## Route Protection

Use Next.js middleware to protect `/portal/*`:

```ts
// middleware.ts
export const config = { matcher: ['/portal/:path*'] }
// Redirect to /login if no valid JWT cookie
```

## i18n Keys Required

Both `vi.json` and `en.json` must include:
- `portal.title`
- `portal.upcoming`
- `portal.past`
- `portal.noAppointments`
- `portal.profile`
- `portal.logout`
- `auth.login`
- `auth.register`
- `auth.email`
- `auth.password`
- `auth.name`

## Security Rules

- Never return `passwordHash` in any API response
- JWT must be stored in HttpOnly, Secure, SameSite=Strict cookies
- All `/portal` and `/api/appointments` routes require valid JWT
- Rate limit login endpoint to prevent brute force
