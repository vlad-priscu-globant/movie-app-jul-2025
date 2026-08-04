import type { Movie } from '~/types'

interface TMDBPopularResponse {
  results: Array<{
    id: number
    title: string
    release_date?: string
    poster_path?: string
  }>
}

export default defineEventHandler(async (): Promise<{ movies: Movie[] }> => {
  const config = useRuntimeConfig()
  const token = config.tmdbApiKey
  const baseUrl = config.tmdbBaseUrl.replace(/\/$/, '')

  if (!token) {
    // Return mock movies fallback if no API key is provided
    return {
      movies: [
        { id: 1, title: 'Inception', year: 2010, image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvUZDB92WsRZ2M3vNx.jpg' },
        { id: 2, title: 'Interstellar', year: 2014, image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
        { id: 3, title: 'The Dark Knight', year: 2008, image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' }
      ]
    }
  }

  const headers: Record<string, string> = {}
  let fetchUrl = `${baseUrl}/movie/popular?language=en-US&page=1`

  if (token.startsWith('eyJ')) {
    headers['Authorization'] = `Bearer ${token}`
  } else {
    fetchUrl += `&api_key=${token}`
  }

  try {
    const data = await $fetch<TMDBPopularResponse>(fetchUrl, { headers })
    const movies: Movie[] = (data.results || []).map(item => ({
      id: item.id,
      title: item.title,
      year: item.release_date ? new Date(item.release_date).getFullYear() : 2026,
      image: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image'
    }))

    return { movies }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: 'Failed to fetch popular movies from TMDB'
    })
  }
})
