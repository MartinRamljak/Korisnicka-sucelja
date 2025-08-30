"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  movieId: string;
}

export default function LikeButton({ movieId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user once
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    loadUser();
  }, []);

  // Check if this movie is liked
  useEffect(() => {
    const checkLiked = async () => {
      if (!userId || !movieId) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("favoritesIDs")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return;
      }

      const favorites: number[] = Array.isArray(profile?.favoritesIDs)
        ? profile.favoritesIDs.map(Number)
        : [];

      setLiked(favorites.includes(Number(movieId)));
    };

    checkLiked();
  }, [userId, movieId]); // re-run when userId or movieId changes

  // Toggle like in DB
  const handleLike = async () => {
    if (!userId) {
      alert("You must be logged in to like movies.");
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked); // optimistic UI

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("favoritesIDs")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching favorites:", error.message);
      return;
    }

    const favorites: number[] = Array.isArray(profile?.favoritesIDs)
      ? profile.favoritesIDs.map(Number)
      : [];

    let updatedFavorites: number[];

    if (newLiked) {
      updatedFavorites = [...new Set([...favorites, Number(movieId)])];
    } else {
      updatedFavorites = favorites.filter((id) => id !== Number(movieId));
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ favoritesIDs: updatedFavorites })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating favorites:", updateError.message);
      setLiked(!newLiked); // rollback if update fails
    }
  };

  return (
    <button
      onClick={handleLike}
      className="absolute top-2 left-2 z-10 p-1 rounded-full bg-black/60 hover:bg-black/80 transition"
    >
      <Heart
        className={`w-6 h-6 sm:w-7 sm:h-7 ${
          liked ? "fill-red-500 text-red-500" : "text-white"
        }`}
      />
    </button>
  );
}
