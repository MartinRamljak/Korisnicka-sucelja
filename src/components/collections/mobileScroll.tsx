'use client'
import { MovieCollection } from "@/src/types/types";
import MovieImageDisplay from "./processCollectionClient";

export default function MobileScroll({ collections }: { collections: MovieCollection[] }) {
    return(
        <div className="flex-col justify-around w-9/12 h-fit">
            <h1
            className="pl-2 mt-20 border-l-4 border-primary"
            style={{ fontSize: 'clamp(1.5rem, 2vw, 4.375rem)' }}
            >
            Collections
            </h1> 

            <div className="flex justify-between">
                <div className="lg:hidden flex justify-between w-full">
                                    {collections.map((collection, index) => (
                                        <div key={`${collection.id}-${index}`}>
                                            <MovieImageDisplay movies = {collection.movies}
                                                collectionTitle={collection.title}
                                                imageType = "poster"
                                                layout= "overlap" />
                                        </div>
                                ))}
                </div>
            </div>
        
        </div>
    );
}