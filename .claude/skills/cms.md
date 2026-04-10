# Skill: CMS Integration (Contentful)

Domain knowledge for the Contentful CMS integration — a Phase 3 deliverable.

## Scope

- Contentful content models for doctors and blog/news content
- Next.js data fetching from Contentful API
- Incremental Static Regeneration (ISR) for CMS-driven pages

## When to Use

Only implement Contentful integration during Phase 3. Do not introduce CMS dependencies in Phase 1 or 2.

## Contentful Content Models

### Doctor Profile

```
Content Type ID: doctor
Fields:
  - name (Short text, required)
  - slug (Short text, required, unique)
  - specialty (Short text, required)
  - bio (Long text)
  - photo (Asset / Media)
  - availableDays (Short text array)
  - languages (Short text array: ['vi', 'en'])
  - consultationFee (Number, 0 for free tier)
  - rating (Number, 0-5)
```

### Blog/News Article

```
Content Type ID: article
Fields:
  - title (Short text, required)
  - slug (Short text, required, unique)
  - excerpt (Short text)
  - body (Rich Text)
  - coverImage (Asset / Media)
  - publishedAt (Date & Time)
  - locale (Short text: 'vi' | 'en')
```

## Environment Variables Required

```
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_PREVIEW_TOKEN=   # optional, for draft previews
```

## Next.js Integration Pattern

```ts
// lib/contentful.ts
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function getDoctors() {
  const entries = await client.getEntries({ content_type: 'doctor' })
  return entries.items
}
```

### ISR on Doctor Pages

```ts
// app/doctors/[slug]/page.tsx
export const revalidate = 3600  // Revalidate every hour
```

## Migration from Mock Data (Phase 1→3)

Phase 1 uses static mock data arrays in the component files.
Phase 3 replaces these with Contentful fetches.
The component props interface should remain the same to minimize refactoring.

## i18n with Contentful

Use Contentful's built-in localization for content fields.
Configure `vi` and `en` locales in the Contentful space settings.
