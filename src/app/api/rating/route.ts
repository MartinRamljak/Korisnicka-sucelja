import { NextResponse } from "next/server";
import { upsertMovieRating } from "@/src/lib/contentful";

// Handle POST /api/rating
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { movieId, userId, rating } = body;

    if (!movieId || !userId || !rating) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    await upsertMovieRating({ movieId, userId, rating });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Rating API error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
