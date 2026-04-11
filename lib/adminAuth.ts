import { jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

export async function verifyAdminRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_session')?.value
  if (!token) return false
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
    return payload.role === 'admin'
  } catch {
    return false
  }
}
