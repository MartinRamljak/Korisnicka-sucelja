'use client'

import { Navigation } from "../../components/navigation/navigation";
import Header from "../../components/header/header";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase, UserProfile } from '../../lib/supabase'
import { User } from '@supabase/supabase-js';
import MovieImageDisplayGrid from "@/src/components/collections/processCollectionClientGrid";
import type { Movie } from "../../types/types";
import { fetchMovieById } from "@/src/lib/fetchMovieById";
import { Footer } from "../../components/footer/footer"

export default function UserProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login_signup')
  }

  // Load user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  // Fetch profile and favorites
  const fetchUserProfile = async (userId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/getUserProfile?userId=${userId}`);
      if (!response.ok) throw new Error(response.statusText);

      const data: UserProfile = await response.json();
      setProfile(data);
      setUsername(data.username);

      // Fetch favorite movies from TMDB
      if (Array.isArray(data.favoritesIDs) && data.favoritesIDs.length > 0) {
        const movies: Movie[] = await Promise.all(
          data.favoritesIDs.map((id) => fetchMovieById(String(id)))
        );
        setFavoriteMovies(movies);
      } else {
        setFavoriteMovies([]);
      }
    } catch (err) {
      console.error('Error fetching profile or favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Navigation />

      <h1 className="text-6xl font-extrabold tracking-tight">User profile</h1>

      {profile ? (
        <>
          <p style={{ marginTop: 16, fontSize: 32 }}>
            Logged in as: <strong>{username}</strong>
          </p>
          <button className="button-logout" onClick={handleLogout}>Log Out</button>

          {/* Favorites */}
          {favoriteMovies.length > 0 && (
            <div className="w-full max-w-[80%] mx-auto"> {/* <-- narrower wrapper */}
              <MovieImageDisplayGrid
                movies={favoriteMovies}
                collectionTitle="Your Favorites"
                imageType="poster"
              />
            </div>
          )}

        </>
      ) : (
        <p>
          <button className="button-logout" onClick={handleLogout}>Log Out</button>
        </p>
      )}
      <Footer />
    </main>
  );
}
