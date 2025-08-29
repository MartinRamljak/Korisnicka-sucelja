"use client";

import type { Movie } from "@/src/types/types";
import { fetchUpcomingMovies } from "@/src/lib/fetchSpecialCollections";
import { useState, useEffect, useRef } from "react";
import { useHorizontalScroll } from "@/src/hooks/horizontalScroll";
import Image from "next/image";
import Link from "next/link";

export default function UpcomingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showLeftArrow, showRightArrow, handleScroll } = useHorizontalScroll(scrollRef);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchUpcomingMovies();
        setMovies(data);
      } catch (err) {
        console.error("Failed to fetch upcoming movies:", err);
      }
    };
    run();
  }, []);

  if (!movies.length) return <p className="text-center mt-8">No upcoming movies found.</p>;

  return (
    <div className="relative w-full max-w-3xl mx-auto flex items-center gap-4 md:gap-6 
        w-[70%] sm:w-[60%] md:w-[80%]">

      {showLeftArrow ? (
        <Image
          onClick={() => handleScroll("left")}
          src="/images/arrow_left.png"
          alt="Left arrow"
          width={48}
          height={48}
          className="hidden md:block cursor-pointer p-2 rounded-2xl border border-gray-500 hover:bg-primary transition"
        />
      ) : (
        <div className="hidden md:block w-12 h-12 p-2 rounded-2xl border border-transparent" />
      )}

      {/* CENTER: the carousel*/}
      <div
        ref={scrollRef}
        className="
          flex-1 min-w-0
          flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4
          [scrollbar-width:none] [-ms-overflow-style:none]
        "
      >

        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="
                relative shrink-0
                snap-start
                grid grid-cols-12 grid-rows-12 p-4 overflow-hidden rounded-xl
                w-[100%]
                h-[300px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px]" >
            <div className="col-span-12 row-span-9 row-start-1 col-start-1 relative">
                <div className="w-full h-full">
                    <img
                    src={
                        movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
                        : "/images/temp.png"
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* dim overlay for readability */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Projector */}
            <img
              src="/images/projector.png"
              alt="projector"
              className="col-span-3 row-span-3 row-start-9 self-end col-start-1 
              w-full h-full object-contain z-10"
            />

            {/* Info */}
            <div className="col-span-5 col-start-4 row-start-10 row-span-3 text-white z-20 w-full h-full object-contain z-10">
              <p className="truncate text-sm sm:text-lg md:text-2xl font-semibold drop-shadow">
                {movie.title}
              </p>
              <p className="truncate text-xs sm:text-sm opacity-80">
                {movie.release_date}
              </p>
            </div>

            {/* Poster */}
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="col-start-9 row-start-7 row-span-6 col-span-3 object-contain z-20 w-full h-full z-10"
              />
            )}
          </Link>
        ))}
      </div>

      {showRightArrow ? (
        <Image
          onClick={() => handleScroll("right")}
          src="/images/arrow_right.png"
          alt="Right arrow"
          width={48}
          height={48}
          className="hidden md:block cursor-pointer p-2 rounded-2xl border border-gray-500 hover:bg-primary transition"
        />
      ) : (
        <div className="hidden md:block w-12 h-12 p-2 rounded-2xl border border-transparent" />
      )}
    </div>
  );
}
