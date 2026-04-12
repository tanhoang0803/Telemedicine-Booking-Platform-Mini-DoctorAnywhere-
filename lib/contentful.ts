// lib/contentful.ts — Contentful CMS integration (Phase 3)
//
// Content model: "doctor"
//   doctorId      Short text   — stable ID used in booking URLs / emails
//   name          Short text
//   slug          Short text   — URL-friendly identifier
//   specialtyKey  Short text   — i18n key (e.g. "general", "cardiology")
//   specialty     Short text   — English label for admin panel / emails
//   photo         Asset        — doctor headshot
//   availableDays Short text   — multiple values (e.g. ["Mon","Wed","Fri"])
//   languages     Short text   — multiple values ("en" | "vi")
//   rating        Number       — 0–5
//
// When CONTENTFUL_SPACE_ID is not set the function returns MOCK_DOCTORS so
// the app works in any environment without CMS credentials.

import { createClient } from 'contentful'
import { MOCK_DOCTORS } from '@/lib/doctors'
import type { Doctor } from '@/lib/doctors'

// Fields as returned by the Contentful REST API (assets resolved to their
// fields object when using client.getEntries with linked entries included).
interface ContentfulDoctorFields {
  doctorId?: string
  name: string
  slug: string
  specialtyKey: string
  specialty: string
  photo?: {
    fields?: {
      file?: { url?: string }
    }
  }
  availableDays?: string[]
  languages?: string[]
  rating: number
}

function getClient() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  if (!spaceId || !accessToken) return null

  return createClient({ space: spaceId, accessToken })
}

function toDoctor(item: {
  sys: { id: string }
  fields: ContentfulDoctorFields
}): Doctor {
  const f = item.fields
  const photoUrl = f.photo?.fields?.file?.url

  return {
    id: f.doctorId ?? item.sys.id,
    slug: f.slug,
    name: f.name,
    specialtyKey: f.specialtyKey,
    specialty: f.specialty,
    photo: photoUrl ? `https:${photoUrl}` : '/images/doctor-placeholder.svg',
    availableDays: f.availableDays ?? [],
    languages: (f.languages ?? []) as ('vi' | 'en')[],
    rating: f.rating,
  }
}

/**
 * Fetches doctors from Contentful ordered by rating descending.
 * Falls back to MOCK_DOCTORS when CMS credentials are not configured.
 */
export async function fetchDoctors(): Promise<Doctor[]> {
  const client = getClient()

  if (!client) {
    return MOCK_DOCTORS
  }

  try {
    const entries = await client.getEntries({
      content_type: 'doctor',
      order: ['-fields.rating' as `fields.${string}`],
    })

    return entries.items.map((item) =>
      toDoctor(item as unknown as { sys: { id: string }; fields: ContentfulDoctorFields })
    )
  } catch (err) {
    console.error('[contentful] fetchDoctors failed — falling back to mock data', err)
    return MOCK_DOCTORS
  }
}
