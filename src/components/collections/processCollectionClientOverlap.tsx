'use client';

import Image from "next/image";
import { Movie } from "@/src/types/types";

interface MovieImageDisplayProps {
  movies: Movie[];
  collectionTitle: string;
  imageType: "poster" | "backdrop";
}

export default function MovieImageDisplayOverlap({
  movies,
  collectionTitle,
  imageType,
}: MovieImageDisplayProps) {
  return (
    <div className="flex flex-col gap-4 w-full mx-auto px-2 sm:px-4">
      <div
        className="relative w-full sm:aspect-[5/2] md:aspect-[7/2] lg:aspect-[5/8]"
        style={{
          
                display: "grid",
                gridTemplateColumns: "repeat(15, minmax(0, 1fr))",
                gridTemplateRows: "repeat(15, minmax(0, 1fr))",
              }}
            
        
      >
        {movies.map((movie, idx) => {
          const zIndex = 30 - idx * 10;

          if (imageType === "poster") {
            return movie.poster_path ? (
              <div
                key={movie.id}
                className={`
                  relative aspect-[2/3] 
                  w-[100%] sm:w-[100%] md:w-full 
                  mx-auto
                `}
                style={{
                  zIndex,
                  // Only stagger images from md and up
                  gridColumn:
                    idx === 0
                      ? "1 / span 13"
                      : idx === 1
                      ? "2 / span 13"
                      : "3 / span 13",
                  gridRow:
                    idx === 0
                      ? "1 / span 13"
                      : idx === 1
                      ? "2 / span 13"
                      : "3 / span 13",
                }}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
                  className="object-contain rounded-lg shadow-md"
                />
              </div>
            ) : (
              <div
                key={movie.id}
                className="bg-gray-200 w-[60%] sm:w-[45%] md:w-full mx-auto aspect-[2/3] flex items-center justify-center rounded-lg"
              >
                <span className="text-gray-500 text-sm">No poster</span>
              </div>
            );
          }
        })}
      </div>

      {/* Title below the images */}
      <h2 className="mb-4 text-xs sm:text-base md:text-2xl lg:text-3xl text-center">
        {collectionTitle}
      </h2>
    </div>
  );
}
