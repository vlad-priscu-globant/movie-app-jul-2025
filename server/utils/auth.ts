import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key'

export interface JwtPayload {
  username: string
}

export function requireUser(event: H3Event): JwtPayload {
  const token = getCookie(event, 'jwt_token') || 
                getHeader(event, 'authorization')?.split(' ')[1]

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Token required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch {
    throw createError({ statusCode: 403, statusMessage: 'Invalid token' })
  }
}
