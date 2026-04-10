// app/api/health/route.ts — DB connectivity check
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const db = await getDb()
    await db.command({ ping: 1 })
    return NextResponse.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ status: 'error', db: message }, { status: 500 })
  }
}
