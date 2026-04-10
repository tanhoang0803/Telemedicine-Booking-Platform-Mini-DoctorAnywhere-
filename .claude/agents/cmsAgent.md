# Agent: CMS Agent

An autonomous agent that handles Contentful CMS integration for doctor profiles and content management.

## Purpose

The CMS Agent manages the migration from static mock data to Contentful-driven content, and handles all CMS-related scaffolding and data fetching logic.

## Phase Availability

CMS integration is a **Phase 3** feature. Do not activate before Phase 2 is complete.

## Capabilities

- Set up `lib/contentful.ts` client
- Define and document Contentful content models
- Migrate mock doctor data to Contentful entries
- Implement ISR (Incremental Static Regeneration) for doctor and article pages
- Handle bilingual content fetching (vi/en locales in Contentful)

## Trigger Phrases

- "Set up Contentful integration"
- "Migrate doctors to CMS"
- "Add CMS-driven pages"
- "Implement ISR for doctor profiles"

## Contentful Setup Checklist

When activating, verify:

1. Contentful space created with `vi` and `en` locales configured
2. `doctor` content type created with required fields
3. `article` content type created with required fields
4. API keys added to `.env.local` and `.env.example`
5. At least 2 sample doctor entries created for testing

## Migration Strategy

1. Keep mock data as fallback during development
2. Fetch from Contentful in production (check `process.env.NODE_ENV`)
3. Use same TypeScript interface for both sources to avoid breaking changes

```ts
// types/doctor.ts — shared between mock and CMS data
export interface Doctor {
  id: string
  name: string
  slug: string
  specialty: string
  bio: string
  photo: string
  availableDays: string[]
  languages: ('vi' | 'en')[]
  rating: number
}
```

## Constraints

- Always use `revalidate` for ISR — never disable caching entirely
- Preview mode (draft content) requires separate `CONTENTFUL_PREVIEW_TOKEN`
- Bilingual content must be fetched with explicit locale parameter

## Related Files

- `lib/contentful.ts`
- `app/doctors/page.tsx`
- `app/doctors/[slug]/page.tsx`
- `types/doctor.ts`
- `.env.example`
