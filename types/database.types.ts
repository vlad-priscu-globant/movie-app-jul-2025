export interface Database {
  public: {
    Tables: {
      favorites: {
        Row: {
          user_id: string
          movie_id: number
        }
        Insert: {
          user_id: string
          movie_id: number
        }
        Update: {
          user_id?: string
          movie_id?: number
        }
      }
    }
  }
}
