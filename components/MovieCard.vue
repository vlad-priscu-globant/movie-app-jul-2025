<script setup lang="ts">
import type { Movie } from '~/types'

const props = defineProps<{
  movie: Movie
}>()

const emit = defineEmits<{
  (e: 'selectMovie', movie: Movie): void
}>()

const { isFavorite, toggleFavorite } = useFavorites()
const user = useSupabaseUser()

const handleCardClick = () => {
  emit('selectMovie', props.movie)
}

const onToggleFavorite = () => {
  if (!user.value) {
    alert('Trebuie să fii autentificat pentru a adăuga la favorite.')
    return
  }
  toggleFavorite(props.movie.id)
}
</script>

<template>
  <div 
    @click="handleCardClick"
    class="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all cursor-pointer border border-gray-700 hover:border-red-600 flex flex-col"
  >
    <!-- Poster Image -->
    <div class="relative aspect-[2/3] overflow-hidden bg-gray-900">
      <img 
        :src="movie.image" 
        :alt="movie.title" 
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
      <!-- Favorite Button -->
      <button 
        @click.stop="onToggleFavorite"
        class="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/80 transition-colors backdrop-blur-xs group-hover:opacity-100 sm:opacity-0"
        :class="isFavorite(movie.id) ? 'opacity-100 text-red-500' : 'text-white/70 hover:text-white'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" :fill="isFavorite(movie.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col justify-between flex-grow">
      <div>
        <h3 class="text-lg font-bold text-white group-hover:text-red-500 transition-colors leading-tight line-clamp-1">
          {{ movie.title }}
        </h3>
        <p class="text-gray-400 text-sm mt-1">{{ movie.year }}</p>
      </div>
      
      <div class="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
        <span>Vezi detalii</span>
        <span class="text-red-500 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </div>
  </div>
</template>
