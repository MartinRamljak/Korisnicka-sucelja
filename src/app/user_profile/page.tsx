'use client'

import { Navigation } from "../../components/navigation/navigation";
import Header from "../../components/header/header";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase, UserProfile } from '../../lib/supabase'
import { User } from '@supabase/supabase-js';

export default function UserProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login_signup')
  }

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  const fetchUserProfile = async (userId: string) => {

  if (!userId) {
    console.error("User ID is missing");
    return;
  }

  try {
    console.log('user.id:', user?.id);
    const response = await fetch(`/api/getUserProfile?userId=${userId}`);

    if (response.ok) {
      const data = await response.json();
      console.log('Fetched Profile:', data);
      setProfile(data);
      setUsername(data.username);
    } else {
      console.error('Error fetching profile:', response.statusText);
    }
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
  }
};

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
      setLoading(false)
    } else {
      console.error('User is not authenticated or user ID is missing');
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Navigation />
      <h1 className="text-6xl font-extrabold tracking-tight">User profile</h1>
      {profile ? (
        <>
        <p style={{marginTop: 16, fontSize: 32}}>
          <span style={{display: "inline"}}>Logged in as: </span>
          <span style={{display: "inline", fontWeight: "bolder"}}>{username}</span>
        </p>
        <button className="button-logout" onClick={handleLogout}>Log Out</button>
        </>
        ) : (
          <p></p>
        )
      }
        
    </main>
  );
}
