<script setup lang="ts">
import type { MovieDetail } from '~/types'

const route = useRoute()
const movieId = computed(() => route.params.id as string)

const { data: movie, pending, error } = await useFetch<MovieDetail>(`/api/movies/${movieId.value}`, {
  key: `movie-detail-${movieId.value}`
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-6">
    <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-red-500 mb-6 transition-colors">
      <span>← Înapoi la filme</span>
    </NuxtLink>

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
