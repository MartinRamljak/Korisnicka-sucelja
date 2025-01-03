import { Navigation } from "../../components/navigation";
import Header from "../../components/header/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User_profile",
};

export default function UserProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Navigation />
      <h1 className="text-6xl font-extrabold tracking-tight">Login/Signup</h1>
    </main>
  );
}
