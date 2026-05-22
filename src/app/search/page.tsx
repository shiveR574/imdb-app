"use client";
import { useEffect, useState } from "react";
import "./page.scss";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import MovieCard from "@/src/components/MovieCard";
import TVShowCard from "@/src/components/TVShowCard";
import PeopleDetails from "@/src/components/PeopleDetails";
import { Movie } from "../../types/movie";
import { TVShow } from "../../types/tvshow";
import { People } from "../../types/people";

type SearchResult =
  | (Movie  & { media_type: "movie" })
  | (TVShow & { media_type: "tv" })
  | (People & { media_type: "person" });

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setCurrentPage(1); // reset to page 1 on new query
  }, [query]);

  useEffect(() => {
    if (!query) return;

    const search = async () => {
      setIsLoading(true);
      try {
        const response = await axios({
          method: "get",
          url: "https://api.themoviedb.org/3/search/multi",
          params: { api_key: TMDB_API_KEY, query, language: "en-US", page: currentPage },
        });

        setResults(response.data.results.map((item: any) => ({
          ...item,
          media_type: item.media_type,
        })));
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [query, currentPage]); // refetch when page changes

  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#6046ff" size={150} />
      </div>
    );
  }

  const movies = results.filter((r) => r.media_type === "movie") as (Movie & { media_type: "movie" })[];
  const tvShows = results.filter((r) => r.media_type === "tv") as (TVShow & { media_type: "tv" })[];
  const people = results.filter((r) => r.media_type === "person") as (People & { media_type: "person" })[];

  return (
    <div>
      <h2 style={{ padding: "24px 3% 0", color: "#f3f3f3" }}>
        Results for: <span style={{ color: "#6046ff" }}>"{query}"</span>
      </h2>

      {results.length === 0 ? (
        <p style={{ padding: "24px 3%", color: "#aaa" }}>No results found.</p>
      ) : (
        <>
          <ul className="search-list">
            {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            {tvShows.map((tvshow) => <TVShowCard key={tvshow.id} tvshow={tvshow} />)}
            {people.map((person) => <PeopleDetails key={person.id} people={person} />)}
          </ul>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>
            <span>{currentPage} out of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}