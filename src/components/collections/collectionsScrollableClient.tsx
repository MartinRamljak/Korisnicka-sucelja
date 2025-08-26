'use client'

import { MovieCollection } from "@/src/types/types";
import Image from "next/image";
import { useRef } from "react";
import MovieImageDisplayOverlap from "./processCollectionClientOverlap";
import MovieImageDisplayGrid from "./processCollectionClientGrid";
import { useHorizontalScroll } from "@/src/hooks/horizontalScroll";

type ScrollableCollectionsProps = {
  collections: MovieCollection[];
  mode: "all" | "random";
};

export default function ScrollableCollections({ collections, mode }: ScrollableCollectionsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showLeftArrow, showRightArrow, handleScroll } = useHorizontalScroll(scrollRef);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-10/12 h-fit">
        <div className="flex justify-between w-full max-w-[90vw] mx-auto">
          {/* Left Arrow (only show in horizontal scroll mode) */}
          {mode === "random" && (showLeftArrow ? (
            <Image
              onClick={() => handleScroll('left')}
              src="/images/arrow_left.png"
              alt="Left arrow"
              width={50}
              height={50}
              className="hidden md:block self-center w-10 md:w-12 md:py-5 md:px-2
                         border-2 border-gray rounded-2xl p-2 
                         hover:bg-primary cursor-pointer duration-300"
            />
          ) : (
            <div className="w-15 md:w-12" />
          ))}

          {/* Scrollable area */}
          {mode === "random" ? (
            <div
              id="desktopScroll"
              ref={scrollRef}
              style={{ scrollSnapType: "x mandatory" }}
              className="flex lg:flex-row lg:space-x-6
                         overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            >
              {collections
                .filter((collection) => collection.movies)
                .map((collection, index) => (
                  <div
                    key={`${collection.id}-${index}`}
                    className="flex-shrink-0 w-[30%] snap-start h-min flex flex-col justify-start"
                  >
                    <MovieImageDisplayOverlap
                      movies={collection.movies!}
                      collectionTitle={collection.title}
                      imageType="poster"
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col space-y-8 w-full">
              {collections
                .filter((collection) => collection.movies)
                .map((collection, index) => (
                  <div
                    key={`${collection.id}-${index}`}
                    className="w-full h-min flex flex-col justify-start"
                  >
                    <MovieImageDisplayGrid
                      movies={collection.movies!}
                      collectionTitle={collection.title}
                      imageType="poster"
                    />
                  </div>
                ))}
            </div>
          )}

          {/* Right Arrow (only show in horizontal scroll mode) */}
          {mode === "random" && (showRightArrow ? (
            <Image
              onClick={() => handleScroll('right')}
              src="/images/arrow_right.png"
              alt="Right arrow"
              width={50}
              height={50}
              className="hidden md:block self-center w-10 md:w-12 md:py-5 md:px-2
                         border-2 border-gray rounded-2xl p-2 
                         hover:bg-primary cursor-pointer duration-300"
            />
          ) : (
            <div className="w-15 md:w-12" />
          ))}
        </div>
      </div>
    </div>
  );
}
