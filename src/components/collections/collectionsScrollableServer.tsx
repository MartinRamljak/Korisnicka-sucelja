import { generateAllCollection, generateRandomCollections } from "@/src/lib/collections";
import ScrollableCollections from "./collectionsScrollableClient";
import { fetchMoviesForCollection } from "@/src/lib/fetchMoviesForCollection";

type FetchCollectionsProps = {
  mode: "all" | "random";
};

export default async function FetchCollections({ mode }: FetchCollectionsProps) {
    let collections;
    
    if(mode === "random"){
        collections = await generateRandomCollections(9);
    }
    else{
        collections = await generateAllCollection();
    }

    const limit = mode === "random" ? 3 : 21;

    const collectionsWithMovies = await Promise.all(
        collections.map(async (collection) => {
        const { movies } = await fetchMoviesForCollection(collection, {
            imageType: "poster",
            limit,
        });
        return { ...collection, movies }; // Merge movies into collection
        })
    );

    return <ScrollableCollections collections = {collectionsWithMovies}  mode={mode} />
}
