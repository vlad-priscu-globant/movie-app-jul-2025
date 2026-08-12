<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Movie } from '../types'
import SearchBar from '../components/SearchBar.vue'
import MovieCard from '../components/MovieCard.vue'
import { fetchPopularMovies, searchMovies } from '../api/localDb'

const router = useRouter()

// Lista de filme afișată în pagină
const movies = ref<Movie[]>([
  {
    id: 1,
    title: 'Inception',
    year: 2010,
    image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
  },
  {
    id: 2,
    title: 'Interstellar',
    year: 2014,
    image: 'https://image.tmdb.org/t/p/w500/gEU2QlsUUHXjNpeMacBjQcs45u.jpg'
  },
  {
    id: 3,
    title: 'Dunkirk',
    year: 2017,
    image: 'https://image.tmdb.org/t/p/w500/ebSnODcju8UT016dzcqhU3N8ZcZ.jpg'
  }
])

// Ce scrie utilizatorul în SearchBar
const searchQuery = ref('')

// Încarcă filmele populare
const loadData = async () => {
  try {
    const popular = await fetchPopularMovies()

    if (popular.length > 0) {
      movies.value = popular
    }
  } catch (e) {
    console.warn(
      'Nu s-au putut prelua filmele din TMDB proxy, se folosesc cele locale:',
      e
    )
  }
}

onMounted(() => {
  loadData()
})

// Debounce pentru search
let searchTimeout: ReturnType<typeof setTimeout>

watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    const query = newQuery.trim()

    // Dacă ștergem căutarea, afișăm iar filmele populare
    if (!query) {
      await loadData()
      return
    }

    try {
      movies.value = await searchMovies(query)
    } catch (e) {
      console.error('Eroare la căutarea filmelor:', e)
    }
  }, 300)
})

// Navigare către pagina filmului
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