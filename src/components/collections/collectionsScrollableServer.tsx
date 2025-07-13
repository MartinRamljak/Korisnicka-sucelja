import { generateRandomCollections } from "@/src/lib/collections";
import ScrollableCollections from "./collectionsScrollableClient";
import { fetchMoviesForCollection } from "@/src/lib/fetchMoviesForCollection";

export default async function FetchCollections() {
    const collections = await generateRandomCollections(9);

    const collectionsWithMovies = await Promise.all(
        collections.map(async (collection) => {
        const { movies } = await fetchMoviesForCollection(collection, {
            imageType: "poster",
            limit: 3,
        });
        return { ...collection, movies }; // Merge movies into collection
        })
    );

    return <ScrollableCollections collections = {collectionsWithMovies}/>
}
