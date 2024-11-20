import { Navigation } from "./navigation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <Navigation />
      <h1 className="text-6xl font-extrabold tracking-tight">Naslovnica</h1>
    </main>
  );
}
