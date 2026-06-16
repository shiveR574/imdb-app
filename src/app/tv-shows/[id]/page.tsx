"use client";
import "./page.scss";
import {use} from "react";
import {useState, useEffect} from "react";
import axios from "axios";
import { TVShowDetails } from "../../../types/tvshowdetails";
import { ClipLoader } from "react-spinners";


export default function TvShowsDetailsPage ({ params }: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tvShowDetails, setTvShowDetails] = useState<TVShowDetails | null>(null);

    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    useEffect(() => {
        getTvShowDetails();
    }, [id]);

    const getTvShowDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios({
                method: "get",
                url: `https://api.themoviedb.org/3/tv/${id}`,
                params: {
                    api_key: TMDB_API_KEY,
                    language: "en-US",
                    append_to_response: "credits,videos,similar",
                }
            });
            setTvShowDetails(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching TV show details: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    
    return (
        isLoading ? (
            <ClipLoader />
        ) : tvShowDetails ? (
        <>
            <div 
            className="tvshow-backdrop"
            style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShowDetails?.backdrop_path})`}}
            >
                <div className="tvshow-details-container">
                    {tvShowDetails.poster_path && (
                        <img 
                        src={`https://image.tmdb.org/t/p/original${tvShowDetails.poster_path}`} 
                        alt={tvShowDetails.name}
                        />
                    )}
                    <div className="tvshow-details-info">
                        <h2 className="tvshow-title">{tvShowDetails.name}</h2>
                        <p className="tvshow-overview">{tvShowDetails.overview}</p>
                        <p className="tvshow-release-date">Release Date: {tvShowDetails.release_date}</p>
                        <p className="tvshow-genres">Genres: {tvShowDetails.genres.map(genre => genre.name).join(", ")}</p>
                        <p className="tvshow-vote-average">Vote Average: {tvShowDetails.vote_average}</p>
                        <p className="tvshow-status">Status: {tvShowDetails.status}</p>
                        {tvShowDetails.tagline && (
                                <div className="tvshow-tagline-container">
                                    Tagline:
                                    <div className="tvshow-tagline">
                                        "{tvShowDetails.tagline}"
                                    </div>
                                </div>
                        )}
                    </div>
                </div>
            </div>
        </>
        ) : (
            <p>TV show details not found.</p>
        )
    )
}