"use client";

import { useEffect, useState } from "react";
import { getMovieGenres } from "@/src/lib/genres";
import type { Genre } from "@/src/types/types";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (selectedGenres: Genre[]) => void;
}

export default function FilterModal({ open, onClose, onApply }: FilterModalProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<Genre[]>([]);
  const [activeTab, setActiveTab] = useState<"movies" | "collections">("movies");

  // Fetch genres when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchGenres = async () => {
      try {
        const data = await getMovieGenres();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Error fetching genres", err);
      }
    };

    fetchGenres();
  }, [open]);

  const toggleGenre = (genre: Genre) => {
    setSelected((prev) =>
      prev.find((g) => g.id === genre.id)
        ? prev.filter((g) => g.id !== genre.id)
        : [...prev, genre]
    );
  };

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-300 dark:border-neutral-700 mb-4">
          <button
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === "movies"
                ? "border-b-2 border-secondary text-secondary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("movies")}
          >
            Movies
          </button>
          <button
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === "collections"
                ? "border-b-2 border-secondary text-secondary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("collections")}
          >
            Collections
          </button>
        </div>

        {/* Content */}
        {activeTab === "movies" && (
          <div>
            <p className="text-gray-500 italic">Movie filters coming soon...</p>
          </div>
        )}

        {activeTab === "collections" && (
          <div>
            <h3 className="text-lg font-bold mb-3">Select Genres</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    selected.find((g) => g.id === genre.id)
                      ? "bg-primary text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
