'use client';

import Image from "next/image";
import { Movie } from "@/src/types/types";

interface MovieImageDisplayProps {
  movies: Movie[];
  collectionTitle: string;
  imageType: "poster" | "backdrop";
  layout: "overlap" | "grid";
}

export default function MovieImageDisplay({
  movies,
  collectionTitle,
  imageType,
  layout,
}: MovieImageDisplayProps) {
  return (
    <div
      className="flex flex-col gap-4 w-full mx-auto"
      style={{ transform: "scale(0.92)" }}
    >
      <div
        className="relative w-full sm:aspect-[5/2] md:aspect-[7/2] lg:aspect-[5/8]"
        style={
          layout === "overlap"
            ? {
                display: "grid",
                gridTemplateColumns: "repeat(15, minmax(0, 1fr))",
                gridTemplateRows: "repeat(15, minmax(0, 1fr))",
              }
            : undefined
        }
      >
        {movies.map((movie, idx) => {
          const zIndex = 30 - idx * 10;
          if (imageType === "poster") {
            return movie.poster_path ? (
              <Image
                key={movie.id}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`aspect-[2/3] object-contain w-full h-full`}
                style={{
                  zIndex,
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
              />
            ) : (
              <div
                key={movie.id}
                className="bg-gray-200 w-full h-full flex items-center justify-center aspect-[2/3]"
              >
                <span className="text-gray-500">No poster</span>
              </div>
            );
          } 
        })}

        
      </div>
      {/* Title below the images */}
        <h2
          className="mb-4 hover:text-primary cursor-pointer duration-300"
          style={{ fontSize: "clamp(1.5rem, 2vw, 4.375rem)" }}
        >
          {collectionTitle}
        </h2>
    </div>
  );
}
