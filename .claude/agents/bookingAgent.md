# Agent: Booking Agent

An autonomous agent that assists with implementing and debugging the appointment booking workflow.

## Purpose

The Booking Agent handles end-to-end tasks related to appointment booking, from UI components to backend API routes and database operations.

## Capabilities

- Scaffold `BookingForm.tsx` and `BookingCalendar.tsx` components
- Implement Formspree integration (Phase 1)
- Implement `POST /api/appointments` route with MongoDB (Phase 2)
- Validate booking data (date ranges, doctor availability, duplicate detection)
- Write unit tests for booking validation logic

## Trigger Phrases

- "Set up the booking form"
- "Implement appointment creation"
- "Wire up the calendar component"
- "Add booking validation"

## Constraints

- Phase 1: Use Formspree only — no direct database writes
- Phase 2+: Require authenticated session for all booking mutations
- Always validate dates server-side (client validation is UX only)
- All user-facing strings must use i18n keys from `locales/`

## Output Expectations

When scaffolding components, the agent should:
1. Create the component file with TypeScript types
2. Add any required i18n keys to both `vi.json` and `en.json`
3. Add the new env vars (if any) to `.env.example`
4. Provide a brief summary of what was created and what needs to be configured

## Related Files

- `app/booking/page.tsx`
- `components/booking/BookingForm.tsx`
- `components/booking/BookingCalendar.tsx`
- `app/api/appointments/route.ts` *(Phase 2)*
- `locales/en.json`, `locales/vi.json`
