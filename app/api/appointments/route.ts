import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/db'
import { verifySessionToken } from '@/lib/auth'
import { AppointmentSchema } from '@/lib/schemas'
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email'

async function getPatientFromRequest(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  if (!token) return null
  try {
    return await verifySessionToken(token)
  } catch {
    return null
  }
}

// Fire-and-forget Formspree ping — admin Gmail notification backup
async function pingFormspree(data: Record<string, string>) {
  const id = process.env.NEXT_PUBLIC_FORMSPREE_ID
  if (!id) return
  fetch(`https://formspree.io/f/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  }).catch((err) => console.error('[Formspree]', err))
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

    const appointmentId = result.insertedId.toString()

    // 1. Patient confirmation email (Resend)
    sendBookingConfirmation({
      to: patient.email,
      patientName: patient.name,
      doctorName,
      specialty,
      preferredDate,
      language,
    })

    // 2. Admin notification email (Resend)
    sendAdminNotification({
      appointmentId,
      patientName: patient.name,
      patientEmail: patient.email,
      doctorName,
      specialty,
      preferredDate,
      notes: notes ?? '',
    })

    // 3. Formspree ping → admin Gmail backup
    pingFormspree({
      _subject: `New booking — ${patient.name} with ${doctorName}`,
      patient: patient.name,
      email: patient.email,
      doctor: doctorName,
      specialty,
      date: preferredDate,
      notes: notes ?? '',
      appointmentId,
    })

    return NextResponse.json({ data: { id: appointmentId } }, { status: 201 })
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
