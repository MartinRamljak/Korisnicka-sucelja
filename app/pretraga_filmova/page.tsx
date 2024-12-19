import type { Metadata } from "next";
import Link from "next/link";
import { BASE_API_URL } from "./url";

export type Movie = {
  userId: number;
  id: number;
  title: string;
  body: string;
  url: string;
  thumbnailUrl: string;
};

type MovieInfo = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type MovieImg = {
  url: string;
  thumbnailUrl: string;
};

type MoviesPageProps = {
  searchParams: { page: string };
};

type PagingInfo = {
  _start?: number;
  _limit?: number;
};

type PaginationProps = {
  currentPage: number;
  pagesCount: number;
};

export const metadata: Metadata = {
  title: "Movie_search",
};

const PAGE_SIZE = 4;

async function getMovies({
  _start = 0,
  _limit = PAGE_SIZE,
}: PagingInfo): Promise<Movie[]> {
  const movieInfo = await getMoviesInfo({_start, _limit});
  const movieImg = await getMoviesImg({_start, _limit});
  const movies = movieImg.map((obj, i) => ({...obj, ...movieInfo[i]}));

  return movies;
}

async function getMoviesInfo({
  _start = 0,
  _limit = PAGE_SIZE,
}: PagingInfo): Promise<MovieInfo[]> {
  const moviesInfo = await fetch(
    `${BASE_API_URL}/posts/?_start=${_start}&_limit=${_limit}`
  );

  return moviesInfo.json();
}

async function getMoviesImg({
  _start = 0,
  _limit = PAGE_SIZE,
}: PagingInfo): Promise<MovieImg[]> {
  const moviesImg = await fetch(
    `${BASE_API_URL}/photos/?_start=${_start}&_limit=${_limit}`
  );

  return moviesImg.json();
}

async function getMoviesCount(): Promise<number> {
  const data = await fetch(`${BASE_API_URL}/posts/?_limit=1`, {
    method: "HEAD",
  });
  let count: string | number = data.headers.get("x-total-count") || "1";
  count = parseInt(count, 10);
  return count;
}

function processMovie(movie: Movie) {
  const { id, title, thumbnailUrl } = movie;
  return (
    <li key={id} className="mb-4">
      <Link
        href={`/pretraga_filmova/${id}`}
        className="movie-result block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors duration-200"
      >
        <img src={thumbnailUrl} className="movie-result-info"></img>
        <div className="movie-result-info">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            Movie {id}: {title}
          </h2>
          <p className="font-normal text-gray-700">
            Click for more details
          </p>
        </div>
      </Link>
    </li>
  );
}

function Pagination(pagination: PaginationProps) {
  const { currentPage, pagesCount } = pagination;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pagesCount;

  return (
    <div className="w-full max-w-2xl mb-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex justify-between items-center">
        <Link
          href={`/pretraga_filmova?page=${currentPage - 1}`}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            isFirstPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-disabled={isFirstPage}
        >
          Previous
        </Link>
        <p className="text-gray-700">
          Page{" "}
          <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
          <span className="font-semibold text-gray-900">{pagesCount}</span>
        </p>
        <Link
          href={`/pretraga_filmova?page=${currentPage + 1}`}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            isLastPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-disabled={isLastPage}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

export default async function MoviesPage({ searchParams }: MoviesPageProps ) {
  const moviesCount = await getMoviesCount();
  const pagesCount = Math.ceil(moviesCount / PAGE_SIZE);
  const searchParamsAwaited = searchParams;
  // Ensure the page number is a positive integer.
  const currentPage = Math.min(
    /^[1-9][0-9]*$/.test(searchParamsAwaited.page) ? Number(searchParamsAwaited.page) : 1,
    pagesCount
  );
  const _start = (currentPage - 1) * PAGE_SIZE;
  const _limit = PAGE_SIZE;

  const movies = await getMovies({ _start, _limit });
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="text-6xl font-extrabold tracking-tight mb-10">Pretaga filmova</h1>
      <Pagination currentPage={currentPage} pagesCount={pagesCount} />
      <ul className="w-full max-w-2xl space-y-4">{movies.map(processMovie)}</ul>
    </main>
  );
}