"use client";

import { fetchNewMovies, fetchPopularMovies } from "@/src/lib/fetchSpecialCollections";
import type { Movie } from "@/src/types/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ReelProps {
  prompt: "new" | "popular";
}

export default function Reel({ prompt }: ReelProps) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data =
          prompt === "new" ? await fetchNewMovies() : await fetchPopularMovies();
        setMovies(data.slice(0, 3));
      } catch (err) {
        console.error(`Failed to fetch ${prompt} movies:`, err);
      }
    })();
  }, [prompt]);

  const slots: (Movie | null)[] = [null, ...movies, null];

  return (
    <div className="w-screen overflow-hidden">
      <div className="flex w-full h-[20vh] sm:h-[30vh] md:h-[40vh] lg:h-[50vh]">
        {/* LEFT HALF-REEL */}
        <div
          aria-hidden
          className="relative shrink-0 pointer-events-none w-[5%] h-full bg-[url('/images/reel.jpg')] bg-no-repeat bg-cover"
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* MIDDLE 3 FULL REELS */}
        {slots.slice(1, 4).map((movie, i) => (
          <div
            key={movie?.id ?? `empty-${i}`}
            className="relative shrink-0 w-[30%] h-full bg-[url('/images/reel.jpg')] bg-no-repeat bg-cover flex items-center justify-center group"
          >
            {/* overlay to dim reel background */}
            <div className="absolute inset-0 bg-black/45 rounded-xl" />

            {movie && (
              <Link
                href={`/movie/${movie.id}`}
                className="w-[97%] h-[75%] relative z-10 flex flex-col justify-end"
              >
                <img
                  src={
                    movie.backdrop_path
                      ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
                      : "/images/temp.png"
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover object-center rounded-lg"
                />

                {/* Movie info box */}
                <div className="absolute bottom-0 w-full h-2/5 bg-gray-700/60 rounded-t-[25%] 
                    px-1 sm:px-4 flex flex-col justify-between py-1
                    opacity-100 lg:opacity-0 group-hover:lg:opacity-100 transition-opacity duration-300"
                >
                  <h3 className="text-white font-semibold truncate text-[0.55rem] sm:text-[0.85rem] md:text-base lg:text-2xl mt-1 sm:mt-2 lg:mt-6">
                    {movie.title}
                  </h3>

                  <div className="flex gap-4 items-center mt-1 sm:mt-2 md:mb-2 text-gray-200 
                  text-[0.45rem] sm:text-xs md:text-sm lg:text-base">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/images/star.png"
                        alt="Star"
                        width={16}
                        height={16}
                        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
                      />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image
                        src="/images/heart.png"
                        alt="Heart"
                        width={16}
                        height={16}
                        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
                      />
                      <span>{Math.floor(movie.popularity)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}

        {/* RIGHT HALF-REEL */}
        <div
          aria-hidden
          className="relative shrink-0 pointer-events-none w-[5%] h-full bg-[url('/images/reel.jpg')] bg-no-repeat bg-cover"
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>
    </div>
  );
}
