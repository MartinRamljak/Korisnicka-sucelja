//Fetches list of all the genres
import { GenresResponse } from "../types/types";
import { fetchTMDB } from './tmdb';

// Export specific API functions
export async function getMovieGenres(): Promise<GenresResponse> {
  return fetchTMDB<GenresResponse>('/genre/movie/list?language=en');
}
