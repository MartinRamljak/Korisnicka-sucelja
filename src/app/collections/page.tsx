import { Navigation } from "../../components/navigation/navigation";
import Header from "../../components/header/header";
import type { Metadata } from "next";
import { Footer } from "@/src/components/footer/footer";
import Search from "@/src/components/search/search";
import FetchCollections from "@/src/components/collections/collectionsScrollableServer";
import { getMovieGenres } from "@/src/lib/genres";

export const metadata: Metadata = {
  title: "Collections",
};

type Props = {
  searchParams?: { genres?: string }; // App Router automatically passes this
};

export default async function CollectionsPage({ searchParams }: Props) {
  const genreIds = searchParams?.genres
    ? searchParams.genres.split(",").map((id) => parseInt(id, 10))
    : [];

  const { genres: allGenres } = await getMovieGenres();

  const selectedGenres = genreIds.length
    ? allGenres.filter((g) => genreIds.includes(g.id))
    : undefined;

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Navigation />

      <h1 className="font-extrabold tracking-tight mt-6 text-4xl sm:text-4xl md:text-5xl lg:text-6xl">
        Collections
      </h1>

      {/* Search bar */}
      <Search />

      {/* Collections */}
      <FetchCollections
        mode={selectedGenres ? "filtered" : "all"} // Use filtered mode if genres are selected
        genreIds={selectedGenres?.map((g) => g.id)} // Pass only the IDs
      />

      <Footer />
    </main>
  );
}
