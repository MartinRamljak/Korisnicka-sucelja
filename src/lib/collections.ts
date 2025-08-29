// Templates for fetching specific collection
import { MovieCollection } from "../types/types";
import { getMovieGenres } from "./genres";

export const BASE_PARAMS = {
    include_adult: 'false',
    language: 'en-US',
    page: '1'
} as const;

const COLLECTION_TEMPLATES = {
    genre: (genre: { id: number; name: string }) => ({
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

    upcoming: () => ({
      id: 'upcoming',
      title: 'Upcoming Movies',
      apiParams: {
        ...BASE_PARAMS,
        sort_by: 'primary_release_date.asc',
        'primary_release_date.gte': new Date().toISOString().split('T')[0], // today or later
      },
      type: 'upcoming' as const,
    }),
    //Add in more as needed
};

// Generate ALL collections (default)
export async function generateAllCollection(): Promise<MovieCollection[]> {
    const { genres } = await getMovieGenres();

    return [
        ...genres.map(COLLECTION_TEMPLATES.genre),
        COLLECTION_TEMPLATES.popular(),
        COLLECTION_TEMPLATES.upcoming(),
    ];
}

// Generate SPECIFIC collection by type
export function generateCollection(
  type: 'popular'
): MovieCollection;
export function generateCollection(
  type: 'genre',
  genre: { id: number; name: string }
): MovieCollection;

export function generateCollection(
  type: 'popular' | 'genre' | 'upcoming',
  genre?: { id: number; name: string }
): MovieCollection {
  switch (type) {
    case 'genre':
      if (!genre) throw new Error('Genre required for genre collections');
      return COLLECTION_TEMPLATES.genre(genre);
    case 'popular':
      return COLLECTION_TEMPLATES.popular();
    case 'upcoming':
      return COLLECTION_TEMPLATES.upcoming();
  }
}

// Random collection generator
export async function generateRandomCollections(count: number): Promise<MovieCollection[]> {
  const collections: MovieCollection[] = [];
  const usedIds = new Set<string>();

  const allPossibleCollections = await generateAllCollection();
  
  const shuffledCollections = [...allPossibleCollections].sort(
    () => 0.5 - Math.random()
  );

  // Take the first N unique collections
  for (const collection of shuffledCollections) {
    if (collections.length >= count) break;
    if (!usedIds.has(collection.id)) {
      usedIds.add(collection.id);
      collections.push(collection);
    }
  }

  return collections;
}

export async function generateCollectionsByGenres(
  selectedGenres: { id: number; name: string }[],
  includePopular: boolean = false
): Promise<MovieCollection[]> {
  if (!selectedGenres || selectedGenres.length === 0) {
    // fallback: return all collections or empty array
    return includePopular ? await generateAllCollection() : [];
  }

  const genreCollections = selectedGenres.map(COLLECTION_TEMPLATES.genre);

  return genreCollections;
}
