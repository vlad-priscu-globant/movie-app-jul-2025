import type { Movie } from '~/types'

interface TMDBSearchResponse {
  results: Array<{
    id: number
    title: string
    release_date?: string
    poster_path?: string
  }>
}

export default defineEventHandler(async (event): Promise<{ movies: Movie[] }> => {
  const query = getQuery(event).query as string

  if (!query) {
    return { movies: [] }
  }

  const config = useRuntimeConfig()
  const token = config.tmdbApiKey
  const baseUrl = config.tmdbBaseUrl.replace(/\/$/, '')

  const headers: Record<string, string> = {}

  let fetchUrl =
    `${baseUrl}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`

  if (token.startsWith('eyJ')) {
    headers['Authorization'] = `Bearer ${token}`
  } else {
    fetchUrl += `&api_key=${token}`
  }

  const data = await $fetch<TMDBSearchResponse>(fetchUrl, { headers })

  const movies: Movie[] = data.results.map(item => ({
    id: item.id,
    title: item.title,
    year: item.release_date
      ? new Date(item.release_date).getFullYear()
      : 2026,
    image: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : ''
  }))

  return { movies }
})
