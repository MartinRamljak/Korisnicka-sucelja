import { Navigation } from "../../components/navigation/navigation";
import Header from "../../components/header/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User_discussions",
};

export default function UserDiscussionsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Navigation />
      <h1 className="text-6xl font-extrabold tracking-tight">Discussions</h1>
    </main>
  );
}
