// lib/doctors.ts — Doctor type and Phase 1 mock data
// Phase 2: Replace MOCK_DOCTORS with MongoDB queries
// Phase 3: Replace with Contentful CMS fetch

export type Doctor = {
  id: string
  slug: string
  name: string
  /** i18n key — look up via t('specialty_' + specialtyKey) in doctors namespace */
  specialtyKey: string
  /** kept for admin panel / emails (always English) */
  specialty: string
  photo: string
  availableDays: string[]
  languages: ('vi' | 'en')[]
  rating: number
}

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    slug: 'nguyen-van-a',
    name: 'Dr. Nguyen Van A',
    specialtyKey: 'general',
    specialty: 'General Practitioner',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Mon', 'Wed', 'Fri'],
    languages: ['vi', 'en'],
    rating: 4.8,
  },
  {
    id: '2',
    slug: 'tran-thi-b',
    name: 'Dr. Tran Thi B',
    specialtyKey: 'pediatrics',
    specialty: 'Pediatrics',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Tue', 'Thu'],
    languages: ['vi'],
    rating: 4.9,
  },
  {
    id: '3',
    slug: 'le-van-c',
    name: 'Dr. Le Van C',
    specialtyKey: 'cardiology',
    specialty: 'Cardiology',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    languages: ['vi', 'en'],
    rating: 4.7,
  },
  {
    id: '4',
    slug: 'pham-thi-d',
    name: 'Dr. Pham Thi D',
    specialtyKey: 'dermatology',
    specialty: 'Dermatology',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Wed', 'Fri'],
    languages: ['vi', 'en'],
    rating: 4.6,
  },
  {
    id: '5',
    slug: 'hoang-van-e',
    name: 'Dr. Hoang Van E',
    specialtyKey: 'internal_medicine',
    specialty: 'Internal Medicine',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Mon', 'Wed', 'Thu'],
    languages: ['vi', 'en'],
    rating: 4.8,
  },
]
