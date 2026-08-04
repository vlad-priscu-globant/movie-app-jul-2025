import type { MovieDetail } from '~/types'

interface TMDBMovieDetailResponse {
  id: number
  title: string
  release_date?: string
  poster_path?: string
  backdrop_path?: string
  overview?: string
  vote_average?: number
  runtime?: number
  genres?: Array<{ id: number; name: string }>
}

export default defineEventHandler(async (event): Promise<MovieDetail> => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Movie ID required' })
  }

  const config = useRuntimeConfig()
  const token = config.tmdbApiKey
  const baseUrl = config.tmdbBaseUrl.replace(/\/$/, '')

  if (!token) {
    return {
      id: Number(id),
      title: 'Movie Detail Demo',
      year: 2026,
      image: 'https://via.placeholder.com/500x750?text=Movie',
      overview: 'Presentation overview text for demonstration.',
      voteAverage: 8.5,
      genres: ['Action', 'Sci-Fi'],
      runtime: 120
    }
  }

  const headers: Record<string, string> = {}
  let fetchUrl = `${baseUrl}/movie/${id}?language=en-US`

  if (token.startsWith('eyJ')) {
    headers['Authorization'] = `Bearer ${token}`
  } else {
    fetchUrl += `&api_key=${token}`
  }

  try {
    const data = await $fetch<TMDBMovieDetailResponse>(fetchUrl, { headers })
    return {
      id: data.id,
      title: data.title,
      year: data.release_date ? new Date(data.release_date).getFullYear() : 2026,
      image: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image',
      backdropImage: data.backdrop_path
        ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
        : undefined,
      overview: data.overview,
      voteAverage: data.vote_average,
      genres: data.genres?.map(g => g.name) || [],
      runtime: data.runtime
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Failed to fetch movie ${id} from TMDB`
    })
  }
})
