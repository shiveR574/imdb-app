'use client';
import React from 'react';
import "../app/home.scss";
import {Movie} from "../types/movie";
import { useEffect, useState, useRef } from 'react';
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
        url: "https://api.themoviedb.org/3/trending/movie/day",
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YWIwYzFiNWMyNGRlOGZlZThjZmYyNzBkM2YxOGU3MCIsIm5iZiI6MTc2MjcwODE3Ny40MzIsInN1YiI6IjY5MTBjYWQxYTQ3M2NmYjY3ZDMxYjI1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.msaRTO0EphZ9heDLWI15S6RSImUUYHuVUP7L8donqxk",
          accept: "application/json", 
        },
        params: {
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
        url: "https://api.themoviedb.org/3/trending/tv/day",
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YWIwYzFiNWMyNGRlOGZlZThjZmYyNzBkM2YxOGU3MCIsIm5iZiI6MTc2MjcwODE3Ny40MzIsInN1YiI6IjY5MTBjYWQxYTQ3M2NmYjY3ZDMxYjI1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.msaRTO0EphZ9heDLWI15S6RSImUUYHuVUP7L8donqxk",
          accept: "application/json", 
        },
        params: {
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


  // another url to try out --> "https://api.themoviedb.org/3/trending/person/week"
  const getTrendingPeople = async () => {
    setIsLoading(true);
    try {
      const response = await axios ({
        method: "get",
        url: "https://api.themoviedb.org/3/person/popular",
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

      const movieListRef = useRef<HTMLUListElement>(null);

      const scrollMovieList = (ref: React.RefObject<HTMLUListElement | null>, direction: "left" | "right") => {
        if (ref.current) {
          ref.current.scrollBy({
            left: direction === "left" ? -300 : 300,
            behavior: "smooth",
          });
        }
      }

      const tvShowListRef = useRef<HTMLUListElement>(null);

      const scrollTvShowList = (ref: React.RefObject<HTMLUListElement | null>, direction: "left" | "right") => {
        if (ref.current) {
          ref.current.scrollBy({
            left: direction === "left" ? -300 : 300,
            behavior: "smooth",
          });
        }
      }

            const peopleListRef = useRef<HTMLUListElement>(null);

      const scrollPeopleList = (ref: React.RefObject<HTMLUListElement | null>, direction: "left" | "right") => {
        if (ref.current) {
          ref.current.scrollBy({
            left: direction === "left" ? -300 : 300,
            behavior: "smooth",
          });
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
    <div className="movies-container">
      <p className="trendingmovies-title">Trending Movies</p>
      <div className="scroll-wrapper">  
        <button className="scroll-button left" onClick={() => scrollMovieList(movieListRef, "left")}>‹</button>
          <ul className="trendingmovie-list" ref={movieListRef}>
            {trendingmovies.map((movie) =>
              <MovieCard
                key = {movie.id}
                movie = {movie}
              />
            )}
          </ul>
        <button className="scroll-button right" onClick={() => scrollMovieList(movieListRef, "right")}>›</button>
      </div>
    </div>

    <div className="tvshows-container">
      <p className="trendingtvshows-title">Trending TV Shows</p>
      <div className="scroll-wrapper">  
        <button className="scroll-button left" onClick={() => scrollTvShowList(tvShowListRef, "left")}>‹</button>
        <ul className="trendingtvshows-list" ref={tvShowListRef}>
          {trendingtvshows.map((tvshow) =>
            <TVShowCard
              key = {tvshow.id}
              tvshow = {tvshow}
            />
          )}
        </ul>
      <button className="scroll-button right" onClick={() => scrollTvShowList(tvShowListRef, "right")}>›</button>
      </div>
    </div>

    <div className="people-container">
      <p className="trendingpeople-title">Trending People</p>
      <div className="scroll-wrapper">
        <button className="scroll-button left" onClick={() => scrollPeopleList(peopleListRef, "left")}>‹</button>
        <ul className="trendingpeople-list" ref={peopleListRef}>
          {trendingpeople.map((people) =>
            <PeopleDetails
              key = {people.id}
              people = {people}
            />
          )}
        </ul>
        <button className="scroll-button right" onClick={() => scrollPeopleList(peopleListRef, "right")}>›</button>
      </div>
    </div>

  </div>
  );
}