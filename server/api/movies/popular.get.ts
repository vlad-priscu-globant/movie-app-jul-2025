import type { Movie, PaginatedMoviesResponse } from '~/types'

interface TMDBPopularResponse {
  results: Array<{
    id: number
    title: string
    release_date?: string
    poster_path?: string
  }>
  total_pages: number
  page: number
}

export default defineEventHandler(async (event): Promise<PaginatedMoviesResponse> => {
  const config = useRuntimeConfig()
  const token = config.tmdbApiKey
  const baseUrl = config.tmdbBaseUrl.replace(/\/$/, '')

  // Read and validate the page query parameter (default: 1, clamp 1–500)
  const query = getQuery(event)
  const rawPage = Number(query.page) || 1
  const page = Math.max(1, Math.min(rawPage, 500))

  if (!token) {
    // Return mock movies fallback if no API key is provided
    return {
      movies: [
        { id: 1, title: 'Inception', year: 2010, image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvUZDB92WsRZ2M3vNx.jpg' },
        { id: 2, title: 'Interstellar', year: 2014, image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
        { id: 3, title: 'The Dark Knight', year: 2008, image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' }
      ],
      totalPages: 1,
      currentPage: 1
    }
  }

  const headers: Record<string, string> = {}
  let fetchUrl = `${baseUrl}/movie/popular?language=en-US&page=${page}`

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

    return {
      movies,
      totalPages: data.total_pages ?? 1,
      currentPage: data.page ?? page
    }
  } catch (err: unknown) {
    const statusCode = err instanceof Error && 'statusCode' in err
      ? (err as Error & { statusCode: number }).statusCode
      : 500
    throw createError({
      statusCode,
      statusMessage: 'Failed to fetch popular movies from TMDB'
    })
  }
})

