import { Navigation } from "../components/navigation/navigation";
import Header from "../components/header/header";
import Search from "../components/search/search";
import type { Metadata } from "next";
import { Footer } from "../components/footer/footer";
import FetchCollections from "../components/collections/collectionsScrollableServer";
import Title from "@/src/components/title/title";
import UpcomingMovies from "../components/upcoming/upcomingMovies";
import Reel from "../components/reel/reel";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Navigation />
      <Search />
      <Title prompt="Upcoming Releases" href="/collections#Upcoming-Movies"/>
      <UpcomingMovies />
      <Title prompt="New in Theatres" href="/collections#New-Movies"/>
      <Reel prompt="new"/>
      <Title prompt="Top this week" href="/collections#Top-This-Week"/>
      <Reel prompt="popular"/>
      <Title prompt="Collections" href="/collections"/>
      <FetchCollections mode="random"/>
      <Footer />
    </main>
  );
}
