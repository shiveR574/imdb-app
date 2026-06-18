"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.scss";
import TVShowCard from "../TVShowCard";
import { TVShow } from "@/src/types/tvshow";
import { ClipLoader } from "react-spinners";
import {useSearchParams, useRouter} from "next/navigation";


export default function TVShowList() {
    
    const [tvShows, setTvShows] = useState<TVShow[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = Number(searchParams.get("page")) || 1;

    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    useEffect(() => {
        getTvShows(currentPage);
    }, [currentPage]);

    const getTvShows = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await axios ({
                method: "get",
                url: "https://api.themoviedb.org/3/discover/tv",
                params: {
                    api_key: TMDB_API_KEY,
                    language: "en-US",
                    page, //pass page number as a parameter
            }
        });
            setTvShows(response.data.results);
            setTotalPages(response.data.total_pages);
            console.log(response.data.results);
        } catch (error) {
            console.error("Error fetching TV shows: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handlePageChange = (page: number) => {
        router.push(`/tv-shows?page=${page}`);
    }

      if (isLoading) {
        return (
            <div className="loading-container">
                <ClipLoader color="#6046ff" size={150} />
            </div>
        )
    }

    
    return (
        <>
            <ul className="tv-show-list">
                {tvShows.map((tvShow) =>
                    <TVShowCard
                        key={tvShow.id}
                        tvshow = {tvShow}
                    />
                )}
            </ul>

            <div className="pagination">
                <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                >
                    
                ← Prev
                </button>

                <span>{currentPage} out of {totalPages}</span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    >

                    Next →
                </button>
            </div>

        </>
    )
}