'use client'
import { MovieCollection } from "@/src/types/types";
import Image from "next/image";
import { useRef } from "react";
import MovieImageDisplay from "./processCollectionClient";
import Title from "@/src/components/title/title";

export default function DesktopScroll({ collections }: { collections: MovieCollection[] }){
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: 'left' | 'right') => {
        if(!scrollRef.current) return;

        const container = scrollRef.current;
        const firstChild = container.firstElementChild as HTMLElement | null;
        const cardWidth = firstChild?.clientWidth || 400;
        const scrollAmount = cardWidth * 1.5;

        container.scrollBy({
            left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
        });
    };

    return (
         <div className="flex flex-col w-10/12 h-fit">
            <Title prompt="Collections"/>
            <div className="flex justify-between w-full max-w-[90vw] mx-auto ">

                <Image 
                    onClick={() => handleScroll('left')}
                    src="/images/arrow_left.png" 
                    alt="Left arrow" 
                    width={50} 
                    height={50}
                    className="hidden md:block self-center  w-10 md:w-12 md:py-5 md:px-2
                                border-2 border-gray rounded-2xl p-2 
                                hover:bg-primary cursor-pointer duration-300" /> 
                
                <div id='desktopScroll'
                    ref={scrollRef}
                    style={{ scrollSnapType: "x mandatory" }}
                    className="hidden lg:flex lg:flex-row lg:space-x-6
                    overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                                {collections
                                    .filter((collection) => collection.movies) // removes undefined/null movies
                                    .map((collection, index) => (
                                        <div
                                        key={`${collection.id}-${index}`}
                                        className="flex-shrink-0 w-[30%] snap-start h-min flex flex-col justify-start"
                                        >
                                        <MovieImageDisplay
                                            movies={collection.movies!}
                                            collectionTitle={collection.title}
                                            imageType="poster"
                                            layout="overlap"
                                        />
                                        </div>
                                    ))}

                    </div> 
                
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
        
            </div>

        </div>
    );
}