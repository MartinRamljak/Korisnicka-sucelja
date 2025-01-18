import { getMovieLists } from "@/src/lib/getCollections";

export async function GET(request) {
  try {
    const data = await getMovieLists(); // Fetch genres using TMDB API
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
