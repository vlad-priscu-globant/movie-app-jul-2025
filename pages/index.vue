<script setup lang="ts">
import type { Movie } from '~/types'

const router = useRouter()

// Starea input-ului de căutare
const searchQuery = ref('')

// Preia filmele populare prin Nuxt SSR useFetch
const { data, pending, error } = await useFetch<{ movies: Movie[] }>('/api/movies/popular', {
  key: 'popular-movies',
  default: () => ({ movies: [] })
})

const movies = computed(() => data.value?.movies || [])

// Stare derivată: returnează doar filmele care conțin textul din searchQuery
const filteredMovies = computed(() => {
  return movies.value.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Navigation către pagina de detalii a filmului
const handleSelectMovie = (movie: Movie) => {
  router.push(`/movie/${movie.id}`)
}
</script>

<template>
  <div>
    <!-- Căutare delegată către componenta SearchBar -->
    <div class="mb-8">
      <SearchBar 
        v-model="searchQuery" 
        placeholder="Filtrează filme după titlu..." 
      />
    </div>

    <!-- Indicator de încărcare -->
    <div v-if="pending" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Mesaj de eroare -->
    <div v-else-if="error" class="bg-red-950/50 border border-red-800 text-red-400 p-4 rounded-lg text-center my-6">
      A apărut o eroare la încărcarea filmelor. Vă rugăm încercați din nou.
    </div>

    <!-- Lista Filtrată utilizând MovieCard -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
      <MovieCard 
        v-for="movie in filteredMovies" 
        :key="movie.id" 
        :movie="movie"
        @select-movie="handleSelectMovie"
      />
    </div>
  </div>
</template>
