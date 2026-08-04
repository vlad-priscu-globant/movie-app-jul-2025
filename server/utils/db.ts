import fs from 'fs-extra'
import { resolve } from 'path'
import type { FavoriteMovie } from '~/types'

const DB_FILE = resolve(process.cwd(), 'db.json')

export async function readFavorites(): Promise<FavoriteMovie[]> {
  try {
    const db = await fs.readJson(DB_FILE)
    return db.favorites || []
  } catch {
    return []
  }
}

export async function writeFavorites(favorites: FavoriteMovie[]): Promise<void> {
  await fs.writeJson(DB_FILE, { favorites }, { spaces: 2 })
}
