import { Navigation } from "../../components/navigation/navigation";
import Header from "../../components/header/header";
import type { Metadata } from "next";
import { Footer } from "@/src/components/footer/footer";
import Search from "@/src/components/search/search";
import FetchCollections from "@/src/components/collections/collectionsScrollableServer";
import Title from "@/src/components/title/title";

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
      <FetchCollections />
      <Footer />
    </main>
  );
}
