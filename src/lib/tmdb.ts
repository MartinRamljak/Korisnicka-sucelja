// Reusable fetch function
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTMDB<T>(endpoint: string): Promise<T> {
  const url = `${TMDB_BASE_URL}${endpoint}`;
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`
    }
  };

  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`TMDB API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}