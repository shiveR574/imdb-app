"use client";   
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.scss";
import MovieCard from "../MovieCard";
import { Movie } from "../../types/movie";
import { ClipLoader } from "react-spinners";
import {useSearchParams, useRouter} from "next/navigation";


export default function MovieList (){

    const [movies, setMovies] = useState<Movie[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = Number(searchParams.get("page")) || 1; // reading the page from URL

    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    useEffect(() => {
        getMovies(currentPage); //pass page number to getMovies function
    }, [currentPage]); //fetch movies when currentPage changes

    const getMovies = async (page: number) =>{ 
        setIsLoading(true); //set loading state to true before fetching data
        try {
            const response = await axios({
            method: "get",
            url: "https://api.themoviedb.org/3/discover/movie",
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US",
                page, //pass page number as a parameter
            }
        });          
            setMovies(response.data.results);
            setTotalPages(response.data.total_pages);
            console.log(response.data.results);
        } catch (error) {
            console.error("Error fetching movies: ", error);
        } finally {
            setIsLoading(false); //always runs after success or error
        }
    }

    const handlePageChange = (page: number) => {
        router.push(`/movies?page=${page}`); //saving page here in URL
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
            <ul className="movie-list">
                {movies.map((movie) => 
                    <MovieCard
                        key={movie.id}
                        movie = {movie}
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


