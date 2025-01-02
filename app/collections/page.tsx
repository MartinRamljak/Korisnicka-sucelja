import { Navigation } from "../navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
};

export default function CollectionsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <Navigation />
      <h1 className="text-6xl font-extrabold tracking-tight">Collections</h1>
    </main>
  );
}
