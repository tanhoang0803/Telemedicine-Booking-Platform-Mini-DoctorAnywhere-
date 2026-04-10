# Agent: Notification Agent

An autonomous agent that handles email notification workflows via Resend.

## Purpose

The Notification Agent manages all transactional email logic — confirmation emails, reminders, and system alerts — using the Resend API.

## Capabilities

- Scaffold email templates (booking confirmation, cancellation, reminder)
- Implement `lib/email.ts` with Resend SDK
- Wire email sending into appointment creation/cancellation API routes
- Test email delivery in development (Resend sandbox mode)

## Trigger Phrases

- "Set up email notifications"
- "Add booking confirmation email"
- "Implement Resend integration"
- "Send appointment reminders"

## Phase Availability

Email notifications are a **Phase 2** feature. Do not implement before MongoDB and authentication are in place.

## Resend Integration Pattern

```ts
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmation({
  to,
  patientName,
  doctorName,
  date,
  language,
}: BookingConfirmationParams) {
  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to,
    subject: language === 'vi'
      ? 'Xác nhận đặt lịch khám'
      : 'Appointment Booking Confirmation',
    html: generateConfirmationHTML({ patientName, doctorName, date, language }),
  })
}
```

## Email Types

| Type                  | Trigger                        | Languages |
|-----------------------|--------------------------------|-----------|
| Booking confirmation  | Appointment created            | vi / en   |
| Cancellation notice   | Appointment cancelled          | vi / en   |
| Appointment reminder  | 24h before appointment *(future)* | vi / en |

## Environment Variables Required

```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

## Constraints

- Always send emails in the patient's preferred language (stored in patient document)
- Never expose API keys in email templates or client-side code
- Log email failures but do not let them fail the HTTP response (email is async concern)

## Related Files

- `lib/email.ts`
- `app/api/appointments/route.ts`
- `locales/en.json`, `locales/vi.json`
