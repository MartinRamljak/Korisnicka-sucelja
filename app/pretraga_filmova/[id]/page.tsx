import Link from "next/link";
import { BASE_API_URL } from "../page";
import type { Movie } from "../page";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie_search",
};

type Params = Promise<{ id: string }>;

type MoviesProps = {
  params: Params;
};

async function getMovie(id: string): Promise<Movie> {
  const data = await fetch(`${BASE_API_URL}/posts/${id}`);
  return data.json();
}

export default async function SearchedMovie({ params }: MoviesProps) {
  const movie = await getMovie(params.id);
  const { id, title, body } = movie;
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <article className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <Link
          href="/pretraga_filmova"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all movies
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Movie {id}: {title}
        </h1>
        <p>{body}</p>
      </article>
    </main>
  );
}