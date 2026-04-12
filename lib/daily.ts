// lib/daily.ts — Daily.co REST client (Phase 3 — WebRTC video)
//
// Creates meeting rooms via the Daily.co REST API.
// Falls back to null when DAILY_API_KEY is not set so the app runs in any
// environment without video credentials — the Join Call button simply won't
// appear until a room URL is stored on the appointment.
//
// Daily.co free tier: 1,000 participant-minutes / month
// API docs: https://docs.daily.co/reference

export interface DailyRoom {
  url: string   // full room URL, e.g. https://yourteam.daily.co/appt-abc
  name: string  // room name, e.g. appt-abc
}

/**
 * Creates a Daily.co meeting room for the given appointment ID.
 * Room expires 48 hours after creation.
 * Returns null when DAILY_API_KEY is not configured.
 */
export async function createDailyRoom(appointmentId: string): Promise<DailyRoom | null> {
  const apiKey = process.env.DAILY_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: `appt-${appointmentId}`,
        properties: {
          // Room expires 48 h from creation
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 48,
          enable_chat: true,
          enable_screenshare: false,
          start_video_off: false,
          start_audio_off: false,
        },
      }),
    })

    if (!res.ok) {
      console.error('[daily] createRoom failed', res.status, await res.text())
      return null
    }

    const data = (await res.json()) as { url: string; name: string }
    return { url: data.url, name: data.name }
  } catch (err) {
    console.error('[daily] createRoom error', err)
    return null
  }
}
