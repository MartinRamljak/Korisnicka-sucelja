import type { Movie } from '../types/types';
import { fetchTMDB } from './tmdb';

export async function fetchUpcomingMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>('/movie/upcoming?language=en-US&page=1');

  return data.results;
}

export async function fetchNewMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>('/movie/now_playing?language=en-US&page=1');

  return data.results;
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>('/movie/top_rated?language=en-US&page=1');

  return data.results;
}
