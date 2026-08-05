import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-08-04',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/login', '/register', '/movie/*'],
    }
  },
  runtimeConfig: {
    tmdbApiKey: process.env.VITE_API_URL || process.env.VITE_TMDB_API_KEY || '',
    tmdbBaseUrl: process.env.VITE_BASE_URL || 'https://api.themoviedb.org/3',
    public: {
      apiBaseUrl: '/api'
    }
  }
})
