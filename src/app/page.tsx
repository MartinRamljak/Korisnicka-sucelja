import { Navigation } from "../components/navigation/navigation";
import Header from "../components/header/header";
import Search from "../components/search/search";
import Reel from "../components/reel/reel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Navigation />
      <Search />
      <Reel showReel="no-reel" />
      
    </main>
  );
}
