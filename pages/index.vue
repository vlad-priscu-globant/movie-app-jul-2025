<script setup lang="ts">
import type { Movie, PaginatedMoviesResponse } from '~/types'

const router = useRouter()

// Starea input-ului de căutare
const searchQuery = ref('')

// Pagina curentă pentru paginare
const currentPage = ref(1)

// Preia filmele populare prin Nuxt SSR useFetch – refetch automat la schimbarea paginii
const { data, pending, error } = await useFetch<PaginatedMoviesResponse>('/api/movies/popular', {
  key: 'popular-movies',
  query: { page: currentPage },
  watch: [currentPage],
  default: () => ({ movies: [], totalPages: 1, currentPage: 1 })
})

const movies = computed(() => data.value?.movies || [])
const totalPages = computed(() => data.value?.totalPages ?? 1)

// Stare derivată: returnează doar filmele care conțin textul din searchQuery
const filteredMovies = computed(() => {
  return movies.value.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Resetează la pagina 1 când utilizatorul modifică textul de căutare
watch(searchQuery, () => {
  currentPage.value = 1
})

// Navigation către pagina de detalii a filmului
const handleSelectMovie = (movie: Movie) => {
  router.push(`/movie/${movie.id}`)
}

// Handler paginare – schimbă pagina și derulează sus
const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

    <!-- Controale de paginare -->
    <PaginationControls
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

