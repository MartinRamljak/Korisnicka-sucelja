'use client';

import { useEffect, useState } from 'react';
import { getMovieGenres } from '@/src/lib/genres';
import type { Genre, GenresResponse } from '@/src/types/types';

export default function GenreList() {
  const [genres, setGenres] = useState<Genre[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGenres() {
      try {
        const data = await getMovieGenres();
        setGenres(data.genres); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load genres');
      } finally {
        setLoading(false);
      }
    }

    loadGenres();
  }, []);

  if (loading) return <div>Loading genres...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Movie Genres</h2>
      <ul>
        {genres.map((genre) => (
          <li key={genre.id}>
            {genre.name} (ID: {genre.id})
          </li>
        ))}
      </ul>
    </div>
  );
}