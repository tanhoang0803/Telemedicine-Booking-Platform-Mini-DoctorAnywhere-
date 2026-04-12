import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdminRequest } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const db = await getDb()
    const appointments = await db
      .collection('appointments')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    const data = appointments.map((a) => ({
      id: a._id.toString(),
      patientName: a.patientName,
      patientEmail: a.patientEmail,
      doctorName: a.doctorName,
      specialty: a.specialty,
      preferredDate: a.preferredDate,
      notes: a.notes,
      status: a.status,
      roomUrl: a.roomUrl ?? null,
      createdAt: a.createdAt,
    }))

    return NextResponse.json({ data })
  } catch (err) {
    console.error('[admin appointments GET]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
