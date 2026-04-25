"use client";   
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.scss";
import MovieCard from "../MovieCard";
import { Movie } from "../../types/movie";
import { ClipLoader } from "react-spinners";


export default function MovieList (){

    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
                api_key: "9ab0c1b5c24de8fee8cff270d3f18e70",
                language: "en-US",
                page, //pass page number as a parameter
            }
        });          
            setMovies(response.data.results);
            setTotalPages(response.data.total_pages);
            console.log(response.data.results);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setIsLoading(false); //always runs after success or error
        }
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
    )
}


