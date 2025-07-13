import { Navigation } from "../components/navigation/navigation";
import Header from "../components/header/header";
import Search from "../components/search/search";
import type { Metadata } from "next";
import Scrollable from "../components/scrollable/scrollable";
import { Footer } from "../components/footer/footer";
import FetchCollections from "../components/collections/collectionsScrollableServer";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Navigation />
      <Search />
      <Scrollable contentType="upcoming" title="Upcoming Releases"/>
      <Scrollable contentType="reel" title="New in Theatres"/>
      <Scrollable contentType="reel" title="Top this week"/>
      <FetchCollections />
      <Footer />
    </main>
  );
}
