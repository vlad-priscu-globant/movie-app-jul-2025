import { requireUser } from '../../utils/auth'
import { readFavorites, writeFavorites } from '../../utils/db'

export default defineEventHandler(async (event): Promise<{ message: string }> => {
  const user = requireUser(event)
  
  const idParam = getRouterParam(event, 'id')
  const id = parseInt(idParam || '', 10)
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  try {
    const favorites = await readFavorites()
    const updated = favorites.filter(item => !(item.id === id && item.addedBy === user.username))

    if (updated.length === favorites.length) {
      throw createError({ statusCode: 404, statusMessage: 'Favorite not found' })
    }

    await writeFavorites(updated)
    return { message: `Favorite ${id} removed` }
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete favorite' })
  }
})
