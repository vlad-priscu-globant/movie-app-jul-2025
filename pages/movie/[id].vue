<script setup lang="ts">
import type { MovieDetail } from '~/types'

const route = useRoute()
const router = useRouter()
const movieId = computed(() => route.params.id as string)
const movieIdNumber = computed(() => parseInt(movieId.value, 10))

const { data: movie, pending, error } = await useFetch<MovieDetail>(`/api/movies/${movieId.value}`, {
  key: `movie-detail-${movieId.value}`
})

const { isFavorite, toggleFavorite, isPending } = useFavorites()
const targetMovieId = computed(() => movie.value?.id || movieIdNumber.value)

const onToggleFavorite = () => {
  toggleFavorite(targetMovieId.value)
}

const handleBack = () => {
  if (import.meta.client && window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-6">
    <button 
      @click="handleBack"
      type="button" 
      class="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-red-500 mb-6 transition-colors cursor-pointer"
    >
      <span>← Înapoi</span>
    </button>

    <!-- Indicator Încărcare -->
    <div v-if="pending" class="flex justify-center py-16">
      <div class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Mesaj de Eroare -->
    <div v-else-if="error || !movie" class="bg-red-950/50 border border-red-800 text-red-400 p-6 rounded-xl text-center my-6">
      <h2 class="text-xl font-bold mb-2">Film Negăsit</h2>
      <p class="text-sm text-gray-300">Detaliile filmului solicitat nu pot fi încărcate.</p>
    </div>

    <!-- Conținut Detalii Film -->
    <div v-else class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      <!-- Banner Fundal -->
      <div v-if="movie.backdropImage" class="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-950">
        <img :src="movie.backdropImage" :alt="movie.title" class="w-full h-full object-cover opacity-60" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
      </div>

      <div class="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 -mt-16 sm:-mt-24 relative z-10">
        <!-- Poster Film -->
        <div class="w-40 sm:w-56 shrink-0 mx-auto md:mx-0 rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-950">
          <img :src="movie.image" :alt="movie.title" class="w-full h-full object-cover" />
        </div>

        <!-- Detalii Text -->
        <div class="flex-grow flex flex-col justify-end">
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white">{{ movie.title }}</h1>
            <span class="text-gray-400 text-xl">({{ movie.year }})</span>
            
            <button 
              @click="onToggleFavorite"
              type="button"
              :disabled="isPending(targetMovieId)"
              class="ml-auto p-2 rounded-full border transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              :class="isFavorite(targetMovieId) ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'"
              :title="isFavorite(targetMovieId) ? 'Elimină din favorite' : 'Adaugă la favorite'"
            >
              <svg v-if="isPending(targetMovieId)" class="animate-spin w-6 h-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" :fill="isFavorite(targetMovieId) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>

          <!-- Genuri & Nota -->
          <div class="flex items-center gap-3 mt-3 flex-wrap">
            <span v-if="movie.voteAverage" class="bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1">
              ★ {{ movie.voteAverage.toFixed(1) }}
            </span>
            <span v-if="movie.runtime" class="text-xs text-gray-400 font-medium">
              ⏱ {{ movie.runtime }} min
            </span>
            <div class="flex gap-2 flex-wrap">
              <span v-for="genre in movie.genres" :key="genre" class="bg-zinc-800 text-gray-300 text-xs px-2.5 py-1 rounded-full border border-zinc-700">
                {{ genre }}
              </span>
            </div>
          </div>

          <!-- Sinopsis -->
          <div class="mt-6">
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Descriere</h3>
            <p class="text-gray-300 leading-relaxed text-sm sm:text-base">
              {{ movie.overview || 'Nu există nicio descriere disponibilă pentru acest film.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
