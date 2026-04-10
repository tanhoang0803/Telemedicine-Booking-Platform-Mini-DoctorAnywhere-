// components/booking/BookingCalendar.tsx — Date/time selection calendar
// Phase 1: Simple date input wrapper. Phase 2: Full availability calendar.

'use client'

interface BookingCalendarProps {
  availableDays: string[]
  onDateSelect: (date: string) => void
  selectedDate?: string
}

const DAY_LABELS: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
}

export default function BookingCalendar({
  availableDays,
  onDateSelect,
  selectedDate,
}: BookingCalendarProps) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {availableDays.map((day) => (
          <span
            key={day}
            className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded"
          >
            {DAY_LABELS[day] ?? day}
          </span>
        ))}
      </div>

      <div>
        <label htmlFor="calendar-date" className="block text-sm font-medium text-gray-700 mb-1">
          Select a Date
        </label>
        <input
          id="calendar-date"
          type="date"
          min={today}
          value={selectedDate ?? ''}
          onChange={(e) => onDateSelect(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Phase 2: Replace above with a full interactive calendar showing real availability */}
    </div>
  )
}
