//Types
export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

export interface Movie {
  id: number;
  title: string;
  adult: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieCollection {
  id: string;
  title: string;
  apiParams: Record<string, string>;
  type: 'genre' | 'popular' | 'new' | 'top' | 'upcoming';
  movies?: Movie[];
}

export interface FetchMoviesOptions {
  imageType?: 'poster' | 'backdrop'; // Default can be set in the function
  limit?: number; // How many movies to return
}

export interface FetchedCollection {
  movies: Movie[];
  imageType: 'poster' | 'backdrop';
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}