// lib/doctors.ts — Doctor type and Phase 1 mock data
// Phase 2: Replace MOCK_DOCTORS with MongoDB queries
// Phase 3: Replace with Contentful CMS fetch

export type Doctor = {
  id: string
  slug: string
  name: string
  specialty: string
  bio: string
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
    specialty: 'General Practitioner',
    bio: 'Experienced in telemedicine consultations for common illnesses and preventive care. Over 8 years of clinical experience.',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Mon', 'Wed', 'Fri'],
    languages: ['vi', 'en'],
    rating: 4.8,
  },
  {
    id: '2',
    slug: 'tran-thi-b',
    name: 'Dr. Tran Thi B',
    specialty: 'Pediatrics',
    bio: 'Specialist in child health and development, with 10+ years of clinical experience in pediatric care.',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Tue', 'Thu'],
    languages: ['vi'],
    rating: 4.9,
  },
  {
    id: '3',
    slug: 'le-van-c',
    name: 'Dr. Le Van C',
    specialty: 'Cardiology',
    bio: 'Board-certified cardiologist with expertise in heart disease prevention, hypertension management, and cardiac rehabilitation.',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    languages: ['vi', 'en'],
    rating: 4.7,
  },
  {
    id: '4',
    slug: 'pham-thi-d',
    name: 'Dr. Pham Thi D',
    specialty: 'Dermatology',
    bio: 'Specializes in skin conditions, acne treatment, cosmetic dermatology, and teledermatology consultations.',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Wed', 'Fri'],
    languages: ['vi', 'en'],
    rating: 4.6,
  },
  {
    id: '5',
    slug: 'hoang-van-e',
    name: 'Dr. Hoang Van E',
    specialty: 'Internal Medicine',
    bio: 'Internist focusing on diabetes management, thyroid disorders, and chronic disease management via telemedicine.',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Mon', 'Wed', 'Thu'],
    languages: ['vi', 'en'],
    rating: 4.8,
  },
]
