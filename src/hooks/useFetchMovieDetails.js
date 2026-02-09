import { useEffect, useState } from "react";
import { API_KEY } from "./useFetchMovies"; 


export function useFetchMovieDetails(selectedId) {
  
  const [movie, setMovie] = useState({});
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState("");

  useEffect(() => {
    
    if (!selectedId) {
      setMovie({});
      setError("");
      return;
    }

    const controller = new AbortController();

    
    async function fetchMovieDetails(selectedId) {
      try {
        setIsLoading(true); 
        setError(null); 

        
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`,
          { signal: controller.signal }
        );

        
        if (!response.ok) throw new Error("Error al cargar los detalles de la película");

        const data = await response.json();

        
        setMovie(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        
        setError(err.message);
        setMovie({});
      } finally {
        setIsLoading(false); 
      }
    }

    
    fetchMovieDetails(selectedId);

    return () => controller.abort();
  }, [selectedId]); 

  
  return { movie, isLoading, error };
}
