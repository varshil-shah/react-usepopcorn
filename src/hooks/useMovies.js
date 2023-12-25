import { useState, useEffect } from "react";

const API_KEY = "606dfd81";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const abortController = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
            { signal: abortController.signal }
          );

          if (!response.ok)
            throw new Error(
              response.statusText ||
                "Something went wrong while fetching movies."
            );

          const data = await response.json();

          if (data.Response === "False")
            throw new Error(data.Error || "No movies found.");

          setMovies(data.Search);
          setError("");
        } catch (error) {
          console.error(error.message);

          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
      return function () {
        abortController.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
