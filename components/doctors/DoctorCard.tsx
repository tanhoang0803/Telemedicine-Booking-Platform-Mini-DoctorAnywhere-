// components/doctors/DoctorCard.tsx — Doctor profile card

import Link from 'next/link'
import Image from 'next/image'

interface Doctor {
  id: string
  name: string
  specialty: string
  bio: string
  photo: string
  availableDays: string[]
  languages: ('vi' | 'en')[]
  rating: number
}

interface DoctorCardProps {
  doctor: Doctor
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={doctor.photo}
            alt={doctor.name}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{doctor.name}</h2>
          <p className="text-sm text-blue-600">{doctor.specialty}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs text-gray-500">{doctor.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>

      <div className="flex flex-wrap gap-1">
        {doctor.availableDays.map((day) => (
          <span key={day} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {day}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
        <div className="flex gap-1">
          {doctor.languages.map((lang) => (
            <span
              key={lang}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase font-medium"
            >
              {lang}
            </span>
          ))}
        </div>

        <Link
          href={`/booking?doctorId=${doctor.id}`}
          className="ml-auto bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          Book
        </Link>
      </div>
    </div>
  )
}
