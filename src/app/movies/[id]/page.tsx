'use client';
import "../page.scss";
import {useState, useEffect} from "react";
import axios from "axios";
import {Movie} from "../../../types/movie";
import { MovieDetails } from "../../../types/moviedetails";
import { ClipLoader } from "react-spinners";
import { use } from "react";

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    useEffect(() => {
        getMovieDetails();
    }, [id]);


    const getMovieDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios({
                method: "get",
                url: `https://api.themoviedb.org/3/movie/${id}`,
                params: {
                    api_key: TMDB_API_KEY,
                    language: "en-US",
                }
            });
            setMovieDetails(response.data);
            console.log(response.data);

        } catch (error) {
            console.error("Error fetching movie details: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="movie-details-page">
            <h1>Movie Details Page</h1>
            {isLoading ? (
                <ClipLoader />
            ) : movieDetails ? (
                <div>
                    <h2>{movieDetails.title}</h2>
                    <p>{movieDetails.overview}</p>
                </div>
            ) : (
                <p>Movie details not found.</p>
            )}
        </div>
    );
}