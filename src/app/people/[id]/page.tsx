"use client"
import "@/src/app/people/[id]/page.scss"
import {use} from "react";
import {useState, useEffect} from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {PeopleDetails}  from "@/src/types/peopledetails";
import { Movie } from "@/src/types/movie";
import { TVShow } from "@/src/types/tvshow";
import MovieCard from "@/src/components/MovieCard";
import TVShowCard from "@/src/components/TVShowCard";

export default function PeopleDetailsPage ({params}: {params: Promise<{id: string}>}) {
    const {id} = use(params);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [peopleDetails, setPeopleDetails] = useState<PeopleDetails | null>(null);

    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    useEffect(() => {
        getPeopleDetails();
    }, [id]);

    const getPeopleDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios ({
                method: "get",
                url: `https://api.themoviedb.org/3/person/${id}`,
                params:{
                    api_key: TMDB_API_KEY,
                    language: "en-US",
                    append_to_response: "combined_credits",
                }
            })
            setPeopleDetails(response.data);
        } catch (error) {
            console.error("Error fetching people details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const movieCredits: Movie[] = peopleDetails
    ? Array.from(
        new Map(
            peopleDetails.combined_credits.cast
                .filter((item) => item.media_type === "movie" && item.poster_path)
                .map((item) => [
                    item.id,
                    {
                        id: item.id,
                        title: item.title ?? "",
                        poster_path: item.poster_path ?? "",
                        overview: item.overview,
                        vote_average: item.vote_average,
                    },
                ])
        ).values()
      )
    : [];

    const tvCredits: TVShow[] = peopleDetails
    ? Array.from(
        new Map(
            peopleDetails.combined_credits.cast
                .filter((item) => item.media_type === "tv" && item.poster_path)
                .map((item) => [
                    item.id,
                    {
                        id: item.id,
                        name: item.name ?? "",
                        poster_path: item.poster_path ?? "",
                        overview: item.overview,
                        vote_average: item.vote_average,
                    },
                ])
        ).values()
      )
    : [];

return (
        isLoading ? (
            <ClipLoader />
        ) : peopleDetails ? (
        <>
            <div className="people-details-container">
                {peopleDetails.profile_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/original${peopleDetails.profile_path}`}
                        alt={peopleDetails.name}
                        className="people-profile-path"
                    />
                )}
            <div className="people-details-info">
                <h1 className="people-name">{peopleDetails.name}</h1>
                <div className="birth-rows">
                    Born in
                    <p className="people-place-of-birth">{peopleDetails.place_of_birth} </p>
                    in
                    <p className="people-birthday">{peopleDetails.birthday}</p>
                </div>
                <p className="people-biography">{peopleDetails.biography}</p>
                <p className="people-popularity">Popularity: {peopleDetails.popularity}</p>
            </div>
        </div>

        <div className="people-movies-container">
            <p className="people-movies-title">Movies</p>
            <ul className="people-movies-list">
                {movieCredits.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </ul>
        </div>

        <div className="people-tvshows-container">
            <p className="people-tvshows-title">TV Shows</p>
            <ul className="people-tvshows-list">
                {tvCredits.map((tvshow) => (
                    <TVShowCard key={tvshow.id} tvshow={tvshow} />
                ))}
            </ul>
        </div>
        </>
        ) : (
            <p>People details not found.</p>
        )
    )
}