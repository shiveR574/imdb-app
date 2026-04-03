"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.scss";
import TVShowCard from "../TVShowCard";
import { TVShow } from "@/src/types/tvshow";
import { ClipLoader } from "react-spinners";


export default function TVShowList() {
    
    const [tvShows, setTvShows] = useState<TVShow[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getTvShows();
    }, [])

    const getTvShows =  () => {
        axios ({
            method: "get",
            url: "https://api.themoviedb.org/3/discover/tv",
            params: {
                api_key: "9ab0c1b5c24de8fee8cff270d3f18e70",
                language: "en-US",
            }
        }).then(response =>{
            setTvShows(response.data.results);
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
        <ul className="tv-show-list">
            {tvShows.map((tvShow) =>
                <TVShowCard
                    key={tvShow.id}
                    tvshow = {tvShow}
                />
            )}
        </ul>
    )
}