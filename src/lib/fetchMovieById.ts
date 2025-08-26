import type { Movie } from '../types/types'
import { fetchTMDB } from './tmdb'

// Get a single movie by ID
export async function fetchMovieById(id: string): Promise<Movie> {
  return fetchTMDB<Movie>(`/movie/${id}`);
}