<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Movie } from '../types'

// Starea listei de filme
const movies = ref<Movie[]>([
  { id: 1, title: 'Inception', year: 2010, image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
  { id: 2, title: 'Interstellar', year: 2014, image: 'https://image.tmdb.org/t/p/w500/gEU2QlsUUHXjNpeMacBjQcs45u.jpg' },
  { id: 3, title: 'Dunkirk', year: 2017, image: 'https://image.tmdb.org/t/p/w500/ebSnODcju8UT016dzcqhU3N8ZcZ.jpg' }
])

// Starea input-ului de căutare
const searchQuery = ref('')

// Stare derivată: returnează doar filmele care conțin textul din searchQuery
const filteredMovies = computed(() => {
  return movies.value.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <div>
    <!-- Căutare locală -->
    <div class="mb-8">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Filtrează filme după titlu..." 
        class="w-full md:w-1/3 bg-gray-800 text-white placeholder-gray-400 px-4 py-2 rounded-lg border border-gray-700 focus:outline-hidden focus:border-red-600 transition-colors"
      />
    </div>

    <!-- Lista Filtrată -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <div 
        v-for="movie in filteredMovies" 
        :key="movie.id" 
        class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
      >
        <img :src="movie.image" :alt="movie.title" class="w-full h-auto object-cover aspect-[2/3]" />
        <div class="p-4">
          <h3 class="text-lg font-bold mb-1 leading-tight">{{ movie.title }}</h3>
          <p class="text-gray-400 text-sm">{{ movie.year }}</p>
        </div>
      </div>
    </div>
  </div>
</template>