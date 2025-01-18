export async function getMovieLists() {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text(); // Log error details
        console.error("Error Response Text:", errorText);
        throw new Error("Failed to fetch data from TMDB");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error Fetching Movie Lists:", error.message);
      throw error; // Rethrow the error for the API route to handle
    }
  }
  