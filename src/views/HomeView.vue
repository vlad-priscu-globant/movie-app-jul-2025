<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import type { Movie } from '../types'

import SearchBar from '../components/SearchBar.vue'
import MovieCard from '../components/MovieCard.vue'

import {
  fetchPopularMovies,
  searchMovies
} from '../api/localDb'

const router = useRouter()

// Lista care este afișată în grid
const movies = ref<Movie[]>([])

// Textul introdus în SearchBar
const searchQuery = ref('')

// Încarcă lista normală de filme populare
const loadData = async () => {
  try {
    movies.value = await fetchPopularMovies()
  } catch (error) {
    console.error(
      'Error loading popular movies:',
      error
    )
  }
}

// La deschiderea paginii încărcăm filmele populare
onMounted(() => {
  loadData()
})

// Timer folosit pentru debounce
let searchTimeout: ReturnType<typeof setTimeout>

// Urmărim ce scrie utilizatorul în SearchBar
watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    const query = newQuery.trim()

    // Dacă SearchBar-ul este gol,
    // revenim la filmele populare
    if (!query) {
      await loadData()
      return
    }

    try {
      // CALL către endpoint-ul nostru cu query-ul
      movies.value = await searchMovies(query)
    } catch (error) {
      console.error(
        'Error searching movies:',
        error
      )
    }
  }, 300)
})

// Când utilizatorul apasă pe un film
const handleSelectMovie = (movie: Movie) => {
  router.push(`/movie/${movie.id}`)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <SearchBar
        v-model="searchQuery"
        placeholder="Caută filme după titlu..."
      />
    </div>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6"
    >
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @select-movie="handleSelectMovie"
      />
    </div>
  </div>
</template>