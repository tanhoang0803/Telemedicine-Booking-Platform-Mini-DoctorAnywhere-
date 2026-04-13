import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyDoctorRequest } from '@/lib/doctorAuth'

export async function GET(request: NextRequest) {
  const doctor = await verifyDoctorRequest(request)
  if (!doctor) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  try {
    const db = await getDb()
    const appointments = await db
      .collection('appointments')
      .find({ doctorName: doctor.name })
      .sort({ preferredDate: 1, createdAt: -1 })
      .toArray()

    const data = appointments.map((a) => ({
      id: a._id.toString(),
      patientName: a.patientName,
      patientEmail: a.patientEmail,
      preferredDate: a.preferredDate,
      notes: a.notes,
      status: a.status,
      roomUrl: a.roomUrl ?? null,
      createdAt: a.createdAt,
    }))

    return NextResponse.json({ data })
  } catch (err) {
    console.error('[doctor appointments GET]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
