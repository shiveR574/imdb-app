"use client";
import "../app/home.scss";
import {Movie} from "../types/movie";
import { useEffect, useState } from 'react';
import axios from "axios";
import { ClipLoader } from "react-spinners";
import MovieCard from '../components/MovieCard';
import { TVShow } from "@/src/types/tvshow";
import TVShowCard from '../components/TVShowCard';
import { People } from "../types/people";
import PeopleDetails from "@/src/components/PeopleDetails";

export default function HomePage() {

  const [trendingmovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingtvshows, setTrendingTvShows] = useState<TVShow[]>([]);
  const [trendingpeople, setTrendingPeople] = useState<People[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  

  useEffect (() => {
    getTrendingMovies();
  }, []);

  useEffect(()=> {
    getTrendingTvShows();
  }, []);

  useEffect(() => {
    getTrendingPeople();
  }, []);

  const getTrendingMovies = async () => {
    setIsLoading(true);
    try {
      const response = await axios ({
        method: "get",
        url: "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
        params: {
          api_key: "9ab0c1b5c24de8fee8cff270d3f18e70",
          language: "en-US",
        }
      });
          setTrendingMovies(response.data.results);
          console.log(response.data.results);
    } catch (error) {
      console.error("Error fetching trending movies: ", error);
    } finally {
      setIsLoading(false);
    }
  }

    const getTrendingTvShows = async () => {
    setIsLoading(true);
    try {
      const response = await axios ({
        method: "get",
        url: "https://api.themoviedb.org/3/trending/tv/day?language=en-US",
        params: {
          api_key: "9ab0c1b5c24de8fee8cff270d3f18e70",
          language: "en-US",
        }
      });
          setTrendingTvShows(response.data.results);
          console.log(response.data.results);
    } catch (error) {
      console.error("Error fetching trending tvshows: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  const getTrendingPeople = async () => {
    setIsLoading(true);
    try {
      const response = await axios ({
        method: "get",
        url: "https://api.themoviedb.org/3/trending/person/week",
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YWIwYzFiNWMyNGRlOGZlZThjZmYyNzBkM2YxOGU3MCIsIm5iZiI6MTc2MjcwODE3Ny40MzIsInN1YiI6IjY5MTBjYWQxYTQ3M2NmYjY3ZDMxYjI1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.msaRTO0EphZ9heDLWI15S6RSImUUYHuVUP7L8donqxk",
          accept: "application/json", 
        },
        params: {
          language: "en-US",
        }
      });
          setTrendingPeople(response.data.results);
          console.log(response.data.results);
        } catch (error) {
          console.error("Error fetching trending people: ", error);
        } finally {
          setIsLoading(false);
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
  <div className="home-page-title">
    {/* <p className="paragraph1">Welcome to IMDB!</p> */}
    {/* <p>To discover the best movies and TV shows, click on the links above or just search on the search bar</p> */}
    
    <div className="movies-container">
      <p className="trendingmovies-title">Trending Movies</p>
        <ul className="trendingmovie-list">
          {trendingmovies.map((movie) =>
            <MovieCard
              key = {movie.id}
              movie = {movie}
            />
          )}
        </ul>
    </div>

    <div className="tvshows-container">
      <p className="trendingtvshows-title">Trending TV Shows</p>
        <ul className="trendingtvshows-list">
          {trendingtvshows.map((tvshow) =>
            <TVShowCard
              key = {tvshow.id}
              tvshow = {tvshow}
            />
          )}
        </ul>
    </div>

    <div className="people-container">
      <p className="trendingpeople-title">Trending People</p>
        <ul className="trendingpeople-list">
          {trendingpeople.map((people) =>
            <PeopleDetails
              key = {people.id}
              people = {people}
            />
          )}
        </ul>
    </div>

  </div>
  );
}