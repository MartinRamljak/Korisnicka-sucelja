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
      className="flex flex-col justify-center gap-4 w-full max-w-[1200px] mx-auto"
      style={{ transform: "scale(0.8)" }}
    >
      <div
        className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh]"
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
          } else {
            return (
              <div
                key={movie.id}
                className={`relative ${
                  layout === "overlap"
                    ? `z-[${zIndex}] ${
                        idx === 0
                          ? "col-span-13 row-span-13"
                          : idx === 1
                          ? "col-start-2 col-span-13 row-start-2 row-span-13"
                          : "col-start-3 col-span-13 row-start-3 row-span-13"
                      }`
                    : "col-span-1"
                }`}
              >
                {movie.backdrop_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover aspect-video"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center aspect-video">
                    <span className="text-gray-500">No backdrop</span>
                  </div>
                )}
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
