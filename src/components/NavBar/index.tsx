"use client";
import { useState } from "react";
import "../NavBar/index.scss";
import dicaprio from "../../assets/dicaprio.jpg";
import IMDB from "../../assets/imdb.png";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Movie } from "../../types/movie";
import MovieCard from "../MovieCard";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);


  const getSearch = () => {


      axios ({
          method: "get",
          url: "https://api.themoviedb.org/3/search/multi",
          params: {
                api_key: "9ab0c1b5c24de8fee8cff270d3f18e70",
                language: "en-US",
                query: query,
          },
      }).then (response => {
        setResults(response.data.results); //SAVE DATA
        console.log(response.data.results); //DEBUG MODE
      }) 
  }

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* <h1 className="navbar-title">IMDB</h1> */}
        <Image src={IMDB} alt="IMDB Logo" className="logo-pic" />

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/movies" onClick={() => setMenuOpen(false)}>Movies</Link>
          <Link href="/tv-shows" onClick={() => setMenuOpen(false)}>TV Shows</Link>
        </div>

        <div className="greeting-content">
          <Image src={dicaprio} alt="Profile Picture" className="profile-pic" />
          <div className="greeting-text-group">
            <p className="greeting-text">Welcome Back</p>
            <p className="greeting-text2">DiCaprio</p>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <input type="text"
         placeholder="Search for movies or TV shows..."
         value={query}
         onChange={(e) => setQuery(e.target.value)}
         onKeyDown={(e) => {
          if (e.key === "Enter") 
            getSearch();
          }}
         />

         <button className="search-btn" onClick={getSearch}>Search</button>

      </div>
      
      
      <div className="results">
          {results.map((item) => 
          <MovieCard
            key = {item.id}
            movie = {item}
          />
          )}
      </div>
      
    </nav>
  );
}
