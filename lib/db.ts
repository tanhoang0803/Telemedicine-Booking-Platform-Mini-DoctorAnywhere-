// lib/db.ts — MongoDB Atlas connection (Phase 2)
// Uses a cached connection to avoid creating multiple connections in Next.js dev mode.

import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set. Add it to .env.local.')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // Allow global caching in development to prevent connection exhaustion
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  const connectedClient = await clientPromise
  return connectedClient.db('telemedicine')
}

export default clientPromise
