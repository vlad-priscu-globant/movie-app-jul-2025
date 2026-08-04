import type { FavoriteMovie } from '~/types'
import { requireUser } from '../../utils/auth'
import { readFavorites } from '../../utils/db'

export default defineEventHandler(async (event): Promise<FavoriteMovie[]> => {
  const user = requireUser(event)
  
  try {
    const favorites = await readFavorites()
    const userFavorites = favorites.filter(item => item.addedBy === user.username)
    return userFavorites
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to read favorites' })
  }
})
