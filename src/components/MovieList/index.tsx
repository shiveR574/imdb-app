"use client";   
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.scss";
import MovieCard from "../MovieCard";
import { Movie } from "../../types/movie";
import { ClipLoader } from "react-spinners";


export default function MovieList (){

    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getMovies();
    }, [])

    const getMovies = async () =>{ 
        await axios({
            method: "get",
            url: "https://api.themoviedb.org/3/discover/movie",
            params: {
                api_key: "9ab0c1b5c24de8fee8cff270d3f18e70",
                language: "en-US",
            }
        }).then(response => {            
            setMovies(response.data.results);
            console.log(response.data.results);
        });

        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <div className="loading-container">
                <ClipLoader color="#6046ff" size={150} />
            </div>
        )
    }

    return (
            <ul className="movie-list">
                {movies.map((movie) => 
                    <MovieCard
                        key={movie.id}
                        movie = {movie}
                    />
                )}
            </ul>
    )
}


