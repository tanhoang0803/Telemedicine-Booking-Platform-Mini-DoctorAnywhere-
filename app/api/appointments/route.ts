import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/db'
import { verifySessionToken } from '@/lib/auth'
import { AppointmentSchema } from '@/lib/schemas'
import { sendBookingConfirmation } from '@/lib/email'

async function getPatientFromRequest(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  if (!token) return null
  try {
    return await verifySessionToken(token)
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const patient = await getPatientFromRequest(request)
    if (!patient) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = AppointmentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
        { status: 400 }
      )
    }

    const { doctorId, doctorName, specialty, preferredDate, notes } = parsed.data
    const db = await getDb()

    // Fetch patient language preference
    const patientDoc = await db
      .collection('patients')
      .findOne({ _id: new ObjectId(patient.sub) })
    const language = (patientDoc?.language ?? 'en') as 'en' | 'vi'

    const result = await db.collection('appointments').insertOne({
      patientId: new ObjectId(patient.sub),
      patientName: patient.name,
      patientEmail: patient.email,
      doctorId,
      doctorName,
      specialty,
      preferredDate,
      notes: notes ?? '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Fire-and-forget confirmation email
    sendBookingConfirmation({
      to: patient.email,
      patientName: patient.name,
      doctorName,
      specialty,
      preferredDate,
      language,
    })

    return NextResponse.json(
      { data: { id: result.insertedId.toString() } },
      { status: 201 }
    )
  } catch (err) {
    console.error('[appointments POST]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const patient = await getPatientFromRequest(request)
    if (!patient) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    const db = await getDb()
    const appointments = await db
      .collection('appointments')
      .find({ patientId: new ObjectId(patient.sub) })
      .sort({ createdAt: -1 })
      .toArray()

    const data = appointments.map((a) => ({
      id: a._id.toString(),
      doctorName: a.doctorName,
      specialty: a.specialty,
      preferredDate: a.preferredDate,
      notes: a.notes,
      status: a.status,
      createdAt: a.createdAt,
    }))

    return NextResponse.json({ data })
  } catch (err) {
    console.error('[appointments GET]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
