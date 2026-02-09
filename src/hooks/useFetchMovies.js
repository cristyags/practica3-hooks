import { useEffect, useState } from "react";

export const API_KEY =
  import.meta.env.VITE_OMDB_API_KEY || "4f7498a6";

export function useFetchMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(
            query
          )}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Error HTTP al consultar OMDb");
        }

        const data = await response.json();

        if (data.Response === "False") {
          throw new Error(data.Error || "Error desconocido desde OMDb");
        }

        setMovies(data.Search);
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(err.message);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();

    return () => controller.abort();
  }, [query]);

  return { movies, isLoading, error };
}
