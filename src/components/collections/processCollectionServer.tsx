// components/ProcessCollection.server.tsx
import { fetchMoviesForCollection } from "@/src/lib/fetchMoviesForCollection";
import { MovieCollection } from "@/src/types/types";
import MovieImageDisplay from "./processCollectionClient";

interface CollectionProps {
  collection: MovieCollection;
  imageType?: "poster" | "backdrop";
  movieCount?: number;
  layout?: "overlap" | "grid";
}

export default async function ProcessCollection({
  collection,
  imageType = "poster",
  movieCount = 3,
  layout = "overlap",
}: CollectionProps) {
  const { movies } = await fetchMoviesForCollection(collection, {
    imageType,
    limit: movieCount,
  });

  return (
    <MovieImageDisplay
      movies={movies}
      collectionTitle={collection.title}
      imageType={imageType}
      layout={layout}
    />
  );
}
