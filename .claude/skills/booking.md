# Skill: Booking

Domain knowledge for the appointment booking feature of the Telemedicine Booking Platform.

## Scope

Covers everything related to how patients book appointments with doctors:
- `app/booking/page.tsx`
- `components/booking/BookingForm.tsx`
- `components/booking/BookingCalendar.tsx`
- API route: `app/api/appointments/route.ts` *(Phase 2)*

## Phase 1 — Formspree Integration

In Phase 1, booking is handled via Formspree (no backend required):

```tsx
<form action={`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`} method="POST">
  <input type="hidden" name="_subject" value="New Appointment Booking" />
  <input name="patientName" required />
  <input name="email" type="email" required />
  <input name="doctorId" type="hidden" value={selectedDoctor.id} />
  <input name="preferredDate" type="date" required />
  <textarea name="notes" />
  <button type="submit">Book Appointment</button>
</form>
```

Formspree handles email delivery. Set `FORMSPREE_ID` in `.env.local`.

## Phase 2 — MongoDB API Integration

Replace Formspree with a Next.js API route:

```ts
// app/api/appointments/route.ts
POST /api/appointments   → Create appointment (auth required)
GET  /api/appointments   → List patient's appointments (auth required)
DELETE /api/appointments/[id] → Cancel appointment (auth required)
```

Appointment document schema:
```ts
{
  _id: ObjectId,
  patientId: ObjectId,
  doctorId: ObjectId,
  date: Date,
  status: 'pending' | 'confirmed' | 'cancelled',
  notes: string,
  createdAt: Date
}
```

## Booking Flow

1. Patient selects doctor from `/doctors`
2. Navigates to `/booking?doctorId=<id>`
3. Fills in `BookingForm` (date, time, notes)
4. Submits → Formspree (Phase 1) or API (Phase 2)
5. Confirmation email sent via Resend (Phase 2)
6. Appointment appears in patient portal

## Validation Rules

- Date must be in the future (no past bookings)
- Time must fall within doctor's available hours
- Patient must be authenticated to book (Phase 2)
- Duplicate bookings for same doctor + date should be rejected

## i18n Keys Required

Both `vi.json` and `en.json` must include:
- `booking.title`
- `booking.selectDoctor`
- `booking.selectDate`
- `booking.selectTime`
- `booking.notes`
- `booking.submit`
- `booking.success`
- `booking.error`
