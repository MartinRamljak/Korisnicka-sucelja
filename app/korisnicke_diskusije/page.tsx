import { Navigation } from "../navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User_discussions",
};

export default function KorisnickeDiskusijePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <Navigation />
      <h1 className="text-6xl font-extrabold tracking-tight">Korisnicke Diskusije</h1>
    </main>
  );
}
