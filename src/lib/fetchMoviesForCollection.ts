import type { FetchedCollection, FetchMoviesOptions, MovieCollection, Movie } from '../types/types'
import { BASE_PARAMS } from './collections';
import { fetchTMDB } from './tmdb'

const DEFAULT_OPTIONS: Required<FetchMoviesOptions> = {
    imageType: 'poster',
    limit: 8
};

export async function fetchMoviesForCollection(
    collection: MovieCollection,
    options: FetchMoviesOptions = {}
): Promise <FetchedCollection> {
    const { imageType, limit } = { ...DEFAULT_OPTIONS, ...options };

    const queryString = new URLSearchParams({
        ...BASE_PARAMS,
        ...collection.apiParams,
    }).toString();

    const data = await fetchTMDB<{ results: Movie[] }>(
        `/discover/movie?${queryString}`
    )

    const movies = data.results
    .filter(movie => 
      imageType === 'poster' 
        ? movie.poster_path 
        : movie.backdrop_path
    )
    .slice(0, limit);
    return {
        movies,
        imageType
    };
}