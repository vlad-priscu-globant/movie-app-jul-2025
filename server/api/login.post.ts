import jwt from 'jsonwebtoken'
import type { AuthResponse } from '~/types'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key'

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  const body = await readBody(event)
  const { username, email, password } = body || {}

  const targetUser = username || email

  if (!targetUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username or email required'
    })
  }

  // Generate JWT token valid for 24h
  const token = jwt.sign({ username: targetUser }, JWT_SECRET, { expiresIn: '24h' })
  return { token }
})
