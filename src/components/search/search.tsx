"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import styles from "./search.module.css";
import { searchMovies } from "@/src/lib/search";
import type { Movie, Genre, MovieCollection } from "@/src/types/types";
import Link from "next/link";
import FilterModal from "./filterModal";
import ScrollableCollections from "@/src/components/collections/collectionsScrollableClient";
import { generateCollectionsByGenres } from "@/src/lib/collections";
import { fetchMoviesForCollection } from "@/src/lib/fetchMoviesForCollection";
import { useRouter } from "next/navigation";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<MovieCollection[]>([]);

  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  // Run search when query changes (autocomplete)
  useEffect(() => {
    const fetchResults = async () => {
      const q = query.trim();
      if (!q) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await searchMovies(q);
        setResults(data.results || []);
      } catch (err) {
        setError("Something went wrong while searching movies.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchResults, 300); // debounce 300ms
    return () => clearTimeout(timeout);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setResults([]); // close dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length > 0) {
      setQuery(results[0].title); // take first result
      setResults([]); // close dropdown
    }
  };

  const handleApplyGenres = (genres: Genre[]) => {
    setSelectedGenres(genres);
    setIsFilterOpen(false);

    if (!genres || genres.length === 0) return; // nothing selected, do nothing

    // REDIRECT TO /collections WITH QUERY PARAMS
    const genreIds = genres.map((g) => g.id).join(",");
    router.push(`/collections?genres=${genreIds}`);
  };

  return (
    <div>
      <div className={styles["search-bar-container"]} ref={containerRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search..."
          className={styles["search-bar"]}
          style={{
            backgroundImage: "url('/images/search_icon.png')",
            backgroundSize: "auto clamp(20px, 3vw, 30px)",
            backgroundPosition: "7px 50%",
            backgroundRepeat: "no-repeat",
            paddingLeft: "clamp(30px, 4vw, 40px)",
          }}
        />

        <button
          type="button"
          className={styles["search-filters"]}
          
          onClick={() => setIsFilterOpen(true)}
          style={{
            backgroundImage: "url('/images/filter_icon.png')",
            backgroundSize: "auto clamp(20px, 3vw, 30px)",
            backgroundPosition: "50% 50%",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Dropdown results */}
        {results.length > 0 && (
        <div className={styles.dropdown}>
            {results.slice(0, 5).map((m) => {
            const year = m.release_date ? new Date(m.release_date).getFullYear() : "N/A";
            return (
                <Link
                    key={m.id}
                    href={`/movie/${m.id}`}
                    className={styles["dropdown-item"]}
                    onClick={() => {
                        setQuery(m.title); // fill input
                        setResults([]); // close dropdown
                    }}
                >
                    <img
                        src={
                        m.poster_path
                            ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
                            : "/images/no_poster.png"
                        }
                        alt={m.title}
                        className={styles["dropdown-poster"]}
                    />
                    <div className={styles["dropdown-text"]}>
                        <span className={styles["dropdown-title"]}>{m.title}</span>
                        <span className={styles["dropdown-year"]}>{year}</span>
                    </div>
                </Link>
            );
            })}
        </div>
        )}

      </div>

      {/* Optional messages */}
      <div style={{ marginTop: "1rem" }}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

       {/* Filter modal */}
      <FilterModal
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyGenres}
      />

      {/*{filteredCollections.length > 0 && (
        <div className="mt-6 w-full">
          <ScrollableCollections collections={filteredCollections} mode="all" />
        </div>
      )}*/}
    </div>
  );
}