// components/PopularMovies.tsx
import { generateCollection } from '@/src/lib/collections';
import { fetchMoviesForCollections } from '@/src/lib/fetchMoviesForCollections';

export default async function PopularMovies() {
  const collection = generateCollection('popular');
  
  // Test both image modes
  const posterResults = await fetchMoviesForCollections(collection, {
    imageType: 'poster',
    limit: 3
  });

  const backdropResults = await fetchMoviesForCollections(collection, {
    imageType: 'backdrop', 
    limit: 3
  });

  return (
    <div className="border p-4 rounded-lg bg-gray-50 space-y-6">
      {/* Collection Metadata Test */}
      <section>
        <h2 className="text-xl font-bold mb-2">{collection.title}</h2>
        <div className="space-y-2">
          <h3 className="font-medium">Collection Data:</h3>
          <pre className="text-sm bg-gray p-2 rounded overflow-x-auto">
            {JSON.stringify(collection, null, 2)}
          </pre>
          <div className="pt-2">
            <h3 className="font-medium">API Params:</h3>
            <pre className="text-sm bg-gray p-2 rounded">
              {new URLSearchParams(collection.apiParams).toString()}
            </pre>
          </div>
        </div>
      </section>

      {/* Poster Mode Test */}
      <section>
        <h3 className="font-bold text-lg mb-2">Poster Mode (Default)</h3>
        <div className="grid grid-cols-3 gap-2">
          {posterResults.movies.map(movie => (
            <div key={movie.id} className="border rounded overflow-hidden">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="bg-gray-200 aspect-[2/3] flex items-center justify-center">
                  <span className="text-xs">No poster</span>
                </div>
              )}
              <p className="p-2 text-sm truncate">{movie.title}</p>
            </div>
          ))}
        </div>
        <pre className="mt-2 text-xs bg-gray p-2 rounded">
          Found {posterResults.movies.length} movies with posters
        </pre>
      </section>

      {/* Backdrop Mode Test */}
      <section>
        <h3 className="font-bold text-lg mb-2">Backdrop Mode</h3>
        <div className="space-y-2">
          {backdropResults.movies.map(movie => (
            <div key={movie.id} className="border rounded overflow-hidden">
              {movie.backdrop_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="bg-gray-200 aspect-video flex items-center justify-center">
                  <span className="text-xs">No backdrop</span>
                </div>
              )}
              <p className="p-2 text-sm truncate">{movie.title}</p>
            </div>
          ))}
        </div>
        <pre className="mt-2 text-xs bg-white p-2 rounded">
          Found {backdropResults.movies.length} movies with backdrops
        </pre>
      </section>
    </div>
  );
}