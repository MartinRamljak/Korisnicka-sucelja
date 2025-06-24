import { Navigation } from "../../components/navigation/navigation";
import Header from "../../components/header/header";
import type { Metadata } from "next";
import { Collections } from "@/src/components/collections/collections";
import { Footer } from "@/src/components/footer/footer";
import GenreList from "@/src/components/test/apitest";
import Search from "@/src/components/search/search";
import PopularMovies from "@/src/components/test/collectionstest";

export const metadata: Metadata = {
  title: "Collections",
};

export default function CollectionsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Navigation />
      <h1 className="text-6xl font-extrabold tracking-tight mt-6">Collections</h1>
      <Search />
      <Collections />
      <GenreList />
      <PopularMovies />
      <Footer />
    </main>
  );
}
