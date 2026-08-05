<script setup lang="ts">
import type { MovieDetail } from '~/types'

const { favoriteIds, isLoaded } = useFavorites()
const router = useRouter()

// Fetch movies based on favoriteIds
const { data: movies, pending, error } = await useAsyncData<MovieDetail[]>(
  'favorite-movies', 
  async () => {
    if (!favoriteIds.value || favoriteIds.value.length === 0) return []
    const promises = favoriteIds.value.map(id => $fetch<MovieDetail>(`/api/movies/${id}`))
    const results = await Promise.all(promises)
    return results.filter(m => m !== null) // Filter out any failed requests
  },
  {
    watch: [favoriteIds]
  }
)

const handleSelectMovie = (movie: any) => {
  router.push(`/movie/${movie.id}`)
}
</script>

<template>
  <div>
    <div class="mb-8 border-b border-gray-800 pb-4">
      <h1 class="text-3xl font-extrabold text-white">Filmele tale favorite</h1>
      <p class="text-gray-400 mt-2">Aici găsești toate filmele pe care le-ai salvat.</p>
    </div>

    <!-- Indicator de încărcare -->
    <div v-if="pending || !isLoaded" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Mesaj de eroare -->
    <div v-else-if="error" class="bg-red-950/50 border border-red-800 text-red-400 p-4 rounded-lg text-center my-6">
      A apărut o eroare la încărcarea filmelor favorite.
    </div>

    <!-- Empty State -->
    <div v-else-if="!movies || movies.length === 0" class="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto text-gray-600 mb-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
      <h2 class="text-xl font-bold text-white mb-2">Niciun film favorit</h2>
      <p class="text-gray-400 max-w-md mx-auto">
        Încă nu ai adăugat niciun film în lista ta de favorite. Explorează filmele populare și salvează-le pe cele care îți plac!
      </p>
      <NuxtLink to="/" class="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
        Descoperă Filme
      </NuxtLink>
    </div>

    <!-- Lista Filme Favorite -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
      <MovieCard 
        v-for="movie in movies" 
        :key="movie.id" 
        :movie="movie"
        @select-movie="handleSelectMovie"
      />
    </div>
  </div>
</template>
