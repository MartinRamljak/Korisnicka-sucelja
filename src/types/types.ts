//Types
export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

// types/movie.ts
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
  title: string;
  movies: Movie[];
}