'use client';

import Image from "next/image";
import { Movie } from "@/src/types/types";
import { useRef } from "react";
import { useHorizontalScroll } from "@/src/hooks/horizontalScroll";
import Link from "next/link";

interface MovieImageDisplayProps {
  movies: Movie[];
  collectionTitle: string;
  imageType: "poster" | "backdrop";
}

export default function MovieImageDisplayGrid({
  movies,
  collectionTitle,
  imageType,
}: MovieImageDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showLeftArrow, showRightArrow, handleScroll } = useHorizontalScroll(scrollRef);

  return (
    <div className="flex flex-col gap-4 w-full mx-auto" style={{ transform: "scale(0.92)" }}>
      {/* Collection title */}
      <h2
        className="mb-1 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold"
      >
        {collectionTitle}
      </h2>

      <div className="relative w-full">
        {/* Left Arrow - hidden on small screens */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute left-0 top-0 h-full z-10 px-2 bg-gray-900/50 hover:bg-gray-800 cursor-pointer items-center justify-center"
          >
            <Image src="/images/arrow_left.png" alt="Left" width={30} height={30} />
          </button>
        )}

        {/* Scrollable movie row */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-2 sm:gap-3 md:gap-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[180px] lg:w-[220px] snap-start flex flex-col cursor-pointer hover:bg-gray-700/20"
            >
              {/* Movie poster */}
              {imageType === "poster" ? (
                movie.poster_path ? (
                  <div className="relative aspect-[2/3] w-full">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-contain w-full h-full"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 w-full aspect-[2/3] flex items-center justify-center">
                    <span className="text-gray-500 text-xs sm:text-sm">No poster</span>
                  </div>
                )
              ) : null}

              {/* Movie info */}
              <div className="mt-1 sm:mt-2 text-center px-1 sm:px-2 pb-4">
                <h3 className="text-xs sm:text-sm md:text-base lg:text-xl font-semibold truncate">{movie.title}</h3>
                <div className="flex justify-around items-center mt-1 text-gray-400 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                        <Image 
                            src="/images/star.png" 
                            alt="Star" 
                            width={16} 
                            height={16} 
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                        />
                        <span className="text-xs sm:text-sm md:text-base">{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1"> 
                        <Image 
                            src="/images/heart.png" 
                            alt="Heart"
                            width={16} 
                            height={16} 
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> 
                        <span className="text-text-xs sm:text-sm md:text-base">{Math.floor(movie.popularity)}</span>
                    </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow - hidden on small screens */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-0 top-0 h-full z-10 px-2 bg-gray-900/50 hover:bg-gray-800 cursor-pointer items-center justify-center"
          >
            <Image src="/images/arrow_right.png" alt="Right" width={30} height={30} />
          </button>
        )}
      </div>
    </div>
  );
}
