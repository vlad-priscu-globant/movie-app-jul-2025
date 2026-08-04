import type { FavoriteMovie } from '~/types'
import { requireUser } from '../../utils/auth'
import { readFavorites } from '../../utils/db'

export default defineEventHandler(async (event): Promise<{ isFavorite: boolean; favorite: FavoriteMovie | null }> => {
  const user = requireUser(event)
  
  const idParam = getRouterParam(event, 'id')
  const id = parseInt(idParam || '', 10)
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  try {
    const favorites = await readFavorites()
    const favorite = favorites.find(item => item.id === id && item.addedBy === user.username)
    return { isFavorite: !!favorite, favorite: favorite || null }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to check favorite' })
  }
})
