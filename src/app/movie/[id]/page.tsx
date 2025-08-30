import Image from "next/image";
import { Movie } from "@/src/types/types";
import { fetchMovieById } from "@/src/lib/fetchMovieById";
import { Navigation } from "@/src/components/navigation/navigation";
import Header from "@/src/components/header/header";
import Comments from "../../../components/comment/comment"
import { Clapperboard } from "lucide-react";
import type { Metadata } from "next";
import  LikeButton  from "@/src/components/like/likeButton"
type Props = { params: { id: string } };

// Dynamic metadata for browser tab
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie: Movie = await fetchMovieById(params.id);
  return {
    title: movie.title, // tab title = movie title
    description: movie.overview, // optional meta description
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = params;
  const movie: Movie = await fetchMovieById(id);
  const idNum = parseInt(id, 10)

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Navigation />

      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Movie Card */}
        <div className="relative flex flex-col md:flex-row items-center gap-6 bg-neutral-900 rounded-2xl shadow-lg p-4 sm:p-6">
          
          {/* Backdrop */}
          {movie.backdrop_path && (
            <div className="absolute inset-0 -z-10">
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                fill
                className="object-cover opacity-30 rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent rounded-2xl" />
            </div>
          )}

          {/* Poster */}
          {movie.poster_path && (
            <div className="relative w-[150px] sm:w-[180px] md:w-[220px] aspect-[2/3] flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover rounded-xl shadow-xl"
              />
              <LikeButton movieId={movie.id.toString()}/>
            </div>
          )}

          {/* Info Section */}
          <div className="flex flex-col gap-3 sm:gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Clapperboard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold">{movie.title}</h1>
            </div>

            <p className="text-gray-400 text-sm sm:text-base">
              Release Date: {movie.release_date}
            </p>
            <p className="text-base sm:text-lg leading-relaxed">{movie.overview}</p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-gray-300 mt-2">
              <div className="flex items-center gap-1">
                <Image 
                  src="/images/star.png" 
                  alt="Star" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                />
                <span className="text-xs sm:text-sm md:text-base">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1"> 
                <Image 
                  src="/images/heart.png" 
                  alt="Heart"
                  width={16} 
                  height={16} 
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" 
                /> 
                <span className="text-xs sm:text-sm md:text-base">{Math.floor(movie.popularity)}</span>
              </div>
            </div>
          </div>
        </div>
        <Comments movieId={idNum} discussionId={null} />
      </div>
    </div>
  );
}
