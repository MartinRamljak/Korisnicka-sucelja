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
import { DiscussionFields } from "@/src/types/contentful";
import fetchDiscussionsByIds from "@/src/lib/fetchListedDisccussions";
import Link from 'next/link';
import { Footer } from "../../components/footer/footer"

export default function UserProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [partDisc, setPartDisc] = useState<DiscussionFields[]>([])

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

      // Fetch participated discussions from contentful
      console.log(data.participatedDiscussionsIDs)
      if (Array.isArray(data.participatedDiscussionsIDs) && data.participatedDiscussionsIDs.length > 0) {
        const discussions: DiscussionFields[] = await fetchDiscussionsByIds(data.participatedDiscussionsIDs)

        setPartDisc(discussions)
      } else {
        setPartDisc([])
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
            <div className="w-full max-w-[80%] mx-auto">
              <MovieImageDisplayGrid
                movies={favoriteMovies}
                collectionTitle="Your Favorites"
                imageType="poster"
              />
            </div>
          )}

          {/* Participated discussions */}
          {partDisc.length > 0 && (
            <div className="w-full max-w-[74%] mx-auto">
              <p className="mb-5 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold">Participated discussions</p>
              {partDisc.map(d => {
                return (
                  <Link key={d.discussionId} href={`/discussions/${d.discussionId}`} className="block no-underline text-inherit">
                    <article className="border-2 rounded-lg p-2 mb-4 transition-shadow duration-200 ease-linear cursor-pointer"
                      style={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 var(--secondary)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 10px var(--secondary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 0 var(--secondary)')}
                    >
                      <h2 className="text-xl font-bold">{d.title}</h2>
                      <p className="text-sm text-gray-600">~{d.posterUsername}</p>
                    </article>
                  </Link>
                );
              })}
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
