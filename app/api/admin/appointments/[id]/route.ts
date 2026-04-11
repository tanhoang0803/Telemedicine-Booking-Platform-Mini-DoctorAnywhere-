import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/db'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { sendStatusUpdate } from '@/lib/email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { status } = await request.json()

    if (!['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Status must be confirmed or cancelled.' }, { status: 400 })
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid appointment ID.' }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection('appointments').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 })
    }

    // Notify patient by email
    sendStatusUpdate({
      to: result.patientEmail,
      patientName: result.patientName,
      doctorName: result.doctorName,
      specialty: result.specialty,
      preferredDate: result.preferredDate,
      status: status as 'confirmed' | 'cancelled',
      language: 'en',
    })

    return NextResponse.json({ data: { id, status } })
  } catch (err) {
    console.error('[admin appointments PATCH]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
