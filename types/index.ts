export interface Movie {
  id: number
  title: string
  year: number
  image: string
}

export interface MovieDetail extends Movie {
  overview?: string
  backdropImage?: string
  voteAverage?: number
  genres?: string[]
  runtime?: number
}

export interface UserCredentials {
  email: string
  password?: string
}

export interface FavoriteMovie {
  id: number
  title: string
  year?: number
  image?: string
  addedBy?: string
}

export interface AuthResponse {
  token: string
}
