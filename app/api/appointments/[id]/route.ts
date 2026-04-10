import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/db'
import { verifySessionToken } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('session')?.value
    if (!token) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    const patient = await verifySessionToken(token)
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid appointment ID.' }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection('appointments').findOneAndUpdate(
      {
        _id: new ObjectId(id),
        patientId: new ObjectId(patient.sub),
        status: 'pending',
      },
      { $set: { status: 'cancelled', updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Appointment not found or cannot be cancelled.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: { id, status: 'cancelled' } })
  } catch (err) {
    console.error('[appointments DELETE]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
