import type { Database } from '~/types/database.types'

export const useFavorites = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  
  // Use Nuxt's useState to share the favorites across components
  const favoriteIds = useState<number[]>('favoriteIds', () => [])
  const isLoaded = useState<boolean>('favoritesLoaded', () => false)

  const loadFavorites = async () => {
    if (!user.value?.id || isLoaded.value) return
    
    const { data, error } = (await supabase
      .from('favorites')
      .select('movie_id')
      .eq('user_id', user.value.id)) as { data: { movie_id: number }[] | null, error: any }
      
    if (!error && data) {
      favoriteIds.value = data.map((row) => Number(row.movie_id))
      isLoaded.value = true
    }
  }

  const toggleFavorite = async (movieId: number) => {
    if (!user.value?.id) {
      // Puteți adăuga logica pentru a redirecționa la login sau afișa o eroare
      return
    }

    const isFav = favoriteIds.value.includes(movieId)

    if (isFav) {
      // Remove from favorites
      favoriteIds.value = favoriteIds.value.filter(id => id !== movieId)
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.value.id)
        .eq('movie_id', movieId)
      
      // If error occurs, revert optimistic update
      if (error) {
        favoriteIds.value.push(movieId)
      }
    } else {
      // Add to favorites
      favoriteIds.value.push(movieId)
      const payload = {
        user_id: user.value.id,
        movie_id: movieId
      } as never
      
      const { error } = await supabase
        .from('favorites')
        .insert(payload)
        
      // If error occurs, revert optimistic update
      if (error) {
        favoriteIds.value = favoriteIds.value.filter(id => id !== movieId)
      }
    }
  }

  const isFavorite = (movieId: number) => {
    return favoriteIds.value.includes(movieId)
  }
  
  // Clear favorites on logout
  watch(user, (newUser) => {
    if (!newUser?.id) {
      favoriteIds.value = []
      isLoaded.value = false
    } else {
      loadFavorites()
    }
  })

  // Incarcă automat la prima rulare dacă e logat
  if (user.value && !isLoaded.value) {
    loadFavorites()
  }

  return {
    favoriteIds,
    isLoaded,
    toggleFavorite,
    isFavorite,
    loadFavorites
  }
}
