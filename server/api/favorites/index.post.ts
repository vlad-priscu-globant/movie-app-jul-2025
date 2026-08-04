import type { FavoriteMovie } from '~/types'
import { requireUser } from '../../utils/auth'
import { readFavorites, writeFavorites } from '../../utils/db'

export default defineEventHandler(async (event): Promise<{ message: string }> => {
  const user = requireUser(event)
  
  const body = await readBody<Partial<FavoriteMovie>>(event)
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Body required' })
  }

  const { id, title } = body
  if (id === undefined || !title) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields: id, title' })
  }

  try {
    const favorites = await readFavorites()
    
    if (favorites.some(item => item.id === id && item.addedBy === user.username)) {
      throw createError({ statusCode: 409, statusMessage: 'Movie already in favorites' })
    }

    favorites.push({ ...body, id, title, addedBy: user.username })
    await writeFavorites(favorites)

    return { message: 'Favorite added' }
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: 'Failed to save favorite' })
  }
})
