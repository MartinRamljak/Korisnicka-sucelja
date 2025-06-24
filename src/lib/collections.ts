//Templates for fetching specific collection
import { MovieCollection, Movie } from "../types/types";
import { getMovieGenres } from "./genres";

export const BASE_PARAMS = {
    include_adult: 'false',
    language: 'en-US',
    page: '1'
} as const;

const COLLECTION_TEMPLATES = {
    genre: ( genre: { id: number; name: string}) => ({
        id: `genre-${genre.id}`,
        title: `${genre.name} Movies`,
        apiParams: {
            ...BASE_PARAMS,
            with_genres: genre.id.toString(),
            sort_by: 'popularity.desc'
        },
        type: 'genre' as const
    }),

    popular: () => ({
        id: 'popular',
        title: 'Popular Movies',
        apiParams: {
            ...BASE_PARAMS,
            sort_by: 'popularity.desc',
            'vote_count.gte': '1000'
        },
        type: 'popular' as const
    }),

    international: () => ({
        id: 'international',
        title: 'Non-English Movies',
        apiParams: {
            ...BASE_PARAMS,
            with_original_language: '!en',
            sort_by: 'popularity.desc'
            
        },
        type: 'international' as const
    })
};

export async function generateAllCollection(): Promise<MovieCollection[]> {
    const { genres } = await getMovieGenres();

    return [
        ...genres.map(COLLECTION_TEMPLATES.genre),
        COLLECTION_TEMPLATES.popular(),
        COLLECTION_TEMPLATES.international()
    ];
}

// Generate SPECIFIC collection by type
export function generateCollection(
  type: 'popular' | 'international'
): MovieCollection;
export function generateCollection(
  type: 'genre',
  genre: { id: number; name: string }
): MovieCollection;
export function generateCollection(
  type: 'popular' | 'genre' | 'international',
  genre?: { id: number; name: string }
): MovieCollection {
  switch (type) {
    case 'genre':
      if (!genre) throw new Error('Genre required for genre collections');
      return COLLECTION_TEMPLATES.genre(genre);
    case 'popular':
      return COLLECTION_TEMPLATES.popular();
    case 'international':
      return COLLECTION_TEMPLATES.international();
  }
}