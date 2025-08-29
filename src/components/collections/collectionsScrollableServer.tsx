import { generateAllCollection, generateRandomCollections, generateCollectionsByGenres } from "@/src/lib/collections";
import ScrollableCollections from "./collectionsScrollableClient";
import { fetchMoviesForCollection } from "@/src/lib/fetchMoviesForCollection";
import { getMovieGenres } from "@/src/lib/genres";

type FetchCollectionsProps = {
  mode?: "all" | "random" | "filtered";
  genreIds?: number[];
};

export default async function FetchCollections({ mode = "all", genreIds }: FetchCollectionsProps) {
  let collections;

  if (genreIds && genreIds.length > 0) {
    const { genres: allGenres } = await getMovieGenres();

    const selectedGenres = allGenres
      .filter((g) => genreIds.includes(g.id))
      .map((g) => ({ id: g.id, name: g.name }));

    collections = await generateCollectionsByGenres(selectedGenres);
  } 
  else if (mode === "random") {
    collections = await generateRandomCollections(9);
  } 
  else {
    collections = await generateAllCollection();
  }

  const limit = mode === "random" ? 3 : 21;

  // Fetch movies for each collection
  const collectionsWithMovies = await Promise.all(
    collections.map(async (collection) => {
      const { movies } = await fetchMoviesForCollection(collection, {
        imageType: "poster",
        limit,
      });
      return { ...collection, movies }; // Merge movies into collection
    })
  );

  return <ScrollableCollections collections={collectionsWithMovies} mode={mode} />;
}
