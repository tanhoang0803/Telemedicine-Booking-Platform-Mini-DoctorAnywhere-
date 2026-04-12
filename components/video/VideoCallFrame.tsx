'use client'

import { useRouter } from '@/i18n/navigation'

interface VideoCallFrameProps {
  roomUrl: string
  doctorName: string
}

export default function VideoCallFrame({ roomUrl, doctorName }: VideoCallFrameProps) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-sm font-medium">
            Consultation with {doctorName}
          </span>
        </div>
        <button
          onClick={() => router.push('/portal')}
          className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Leave Call
        </button>
      </div>

      {/* Daily.co prebuilt iframe */}
      <iframe
        src={roomUrl}
        allow="camera; microphone; fullscreen; speaker; display-capture"
        className="flex-1 w-full border-0"
        title={`Video consultation with ${doctorName}`}
      />
    </div>
  )
}
