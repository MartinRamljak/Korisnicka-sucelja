"use client"
import { useEffect, useState } from "react";

export default function MovieGenres() {
  interface Genre {
    id: number;
    name: string;
  }

  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch("/api/genresRoute"); // Call your API route
        if (!response.ok) {
          throw new Error("Failed to fetch genres");
        }
        const data = await response.json();
        setGenres(data.genres); // TMDB's response has a 'genres' key
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }

    fetchGenres();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!genres.length) return <p>Loading genres...</p>;

  return (
    <div>
      <h1>Movie Genres</h1>
      <ul>
        {genres.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))}
      </ul>
    </div>
  );
}
