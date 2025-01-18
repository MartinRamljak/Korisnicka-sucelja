import { Navigation } from "../../components/navigation/navigation";
import Header from "../../components/header/header";
import type { Metadata } from "next";
import { Collections } from "@/src/components/collections/collections";
import { Footer } from "@/src/components/footer/footer";
import MovieGenres from "@/src/components/test/apitest";

export const metadata: Metadata = {
  title: "Collections",
};

export default function CollectionsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Navigation />
      <h1 className="text-6xl font-extrabold tracking-tight">Collections</h1>
      <Collections />
      <MovieGenres />
      <Footer />
    </main>
  );
}
