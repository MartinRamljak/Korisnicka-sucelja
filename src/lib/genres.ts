import { Genre, GenresResponse } from "../types/types";

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Reusable fetch function
async function fetchTMDB<T>(endpoint: string): Promise<T> {
  const url = `${TMDB_BASE_URL}${endpoint}`;
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`
    }
  };

  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`TMDB API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// Export specific API functions
export async function getMovieGenres(): Promise<GenresResponse> {
  return fetchTMDB<GenresResponse>('/genre/movie/list?language=en');
}
