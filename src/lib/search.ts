
import { fetchTMDB } from "./tmdb"; 
import type { SearchResponse } from "@/src/types/types"; 

export async function searchMovies(query: string, page = 1): Promise<SearchResponse> {

  const endpoint =
    `/search/movie?query=${encodeURIComponent(query)}` +
    `&include_adult=false&language=en-US&page=${page}`;

  return fetchTMDB<SearchResponse>(endpoint);
}
