'use client';
import "./page.scss";
import {useState, useEffect} from "react";
import axios from "axios";
import { MovieDetails } from "../../../types/moviedetails";
import { ClipLoader } from "react-spinners";
import { use } from "react";
import MovieCard from "@/src/components/MovieCard";
import PeopleDetails from "@/src/components/PeopleDetails";

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
                    append_to_response: "credits,videos,similar",
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
        isLoading ?(
        <ClipLoader />
        ) : movieDetails ? (
        <>
            <div 
            className="movie-backdrop"
            style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails?.backdrop_path})`}}
            >
                    <div className="movie-details-container">
                        {movieDetails.poster_path && (
                            <img 
                            src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`} 
                            alt={movieDetails.title} 
                            className="movie-poster-path" 
                            />
                            )}
                        <div className="movie-details-info">
                            <h2 className="movie-title">{movieDetails.title}</h2>
                            <p className="movie-overview">{movieDetails.overview}</p>
                            <p className="movie-release-date">Release Date: {movieDetails.release_date}</p>
                            <p className="movie-runtime">Runtime: {movieDetails.runtime} minutes</p>
                            <p className="movie-genres">Genres: {movieDetails.genres.map(genre => genre.name).join(", ")}</p>
                            <p className="movie-vote-average">Vote Average: {movieDetails.vote_average}</p>
                            <p className="movie-status">Status: {movieDetails.status}</p>
                            {movieDetails.tagline && (
                                <div className="movie-tagline-container">
                                    Tagline:
                                    <div className="movie-tagline">
                                        "{movieDetails.tagline}"
                                    </div>
                                </div>
                            )}
                            {(() => {
                                const trailer = movieDetails.videos.results.find(
                                    (v) => v.type === "Trailer" && v.site === "YouTube"
                                );
                                return trailer ? (
                                    <a
                                        href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="movie-trailer-link"
                                    >
                                        ▶ Watch Trailer
                                    </a>
                                ) : null;
                            })()}
                        </div>
                    </div>
            </div>
            <div className="movie-cast-container">
                <div className="movie-cast-title-container">
                    Cast of
                <div className="movie-cast-title">
                    "{movieDetails.title}"
                </div>
                </div>
                <ul className="movie-cast-list">
                    {movieDetails.credits.cast.slice(0, 10).map((person) => (
                        <PeopleDetails key={person.id} people={person} />
                    ))}
                </ul>
            </div>
            <div className="movie-crew-container">
                <div className="movie-crew-title-container">
                    Crew of
                <div className="movie-crew-title">
                    "{movieDetails.title}"
                </div>
                </div>
                <ul className="movie-crew-list">
                    {movieDetails.credits.crew.slice(0, 10).map((person, index) => (
                        <PeopleDetails key={`${person.id}-${index}`} people={person} />
                    ))}
                </ul>
            </div>
            <div className="similar-movies-container">
                <div className="similar-movies-title-container">
                    If you liked 
                    <div className="similar-movies-title">
                        "{movieDetails.title}"
                    </div>
                    , you might also like:
                </div>
                <ul className="similar-movies-list">
                    {movieDetails.similar.results.slice(0,10).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                    }
                </ul>
            </div>
        </>
        ) : (
            <p>Movie details not found.</p>
        )
    );
}