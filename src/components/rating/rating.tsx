"use client";

import { useEffect, useState } from "react";
import { getMovieRating } from "@/src/lib/contentful"; // only safe read op
import { supabase } from "@/src/lib/supabase";

interface RatingProps {
  movieId: number;
}

export default function Rating({ movieId }: RatingProps) {
  const [rating, setRating] = useState<number>(0); // saved rating
  const [hover, setHover] = useState<number>(0);   // hover preview
  const [selected, setSelected] = useState<number>(0); // chosen before save
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

// Fetch existing rating
useEffect(() => {
  if (!userId) {
    setLoading(false); // <-- make sure loading stops if user is not logged in
    return;
  }

  const fetchRating = async () => {
    setLoading(true);
    const existingRating = await getMovieRating(movieId, userId);
    if (existingRating !== null) {
      setRating(existingRating);
      setSelected(existingRating);
    }
    setLoading(false);
  };
  fetchRating();
}, [userId, movieId]);


  const handleSave = async () => {
    if (!userId) {
      alert("You must be logged in to rate movies.");
      return;
    }
    if (selected === 0) return;

    setRating(selected);
    setIsOpen(false);

    try {
      await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movieId,
          userId: userId,
          rating: selected,
        }),
      });
    } catch (err) {
      console.error("Error saving rating:", err);
    }
  };

  if (loading) {
    return (
      <button className="flex items-center gap-2 text-gray-500" disabled>
        <span className="text-xl">⭐</span>
        <span className="font-medium">Loading...</span>
      </button>
    );
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition"
      >
        <span className="text-xl">⭐</span>
        <span className="font-medium">{rating ? `${rating}/10` : "Rate"}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4 text-center">Rate this movie</h2>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-3xl transition ${
                    (hover || selected) >= star ? "text-yellow-400" : "text-gray-500"
                  }`}
                  onClick={() => setSelected(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={selected === 0}
                className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 disabled:opacity-50"
              >
                Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
