"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();


  const getSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* <h1 className="navbar-title">IMDB</h1> */}
        <Image src={IMDB} alt="IMDB Logo" className="logo-pic" priority />

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
         placeholder="Search for movies, TV shows or people..."
         value={query}
         onChange={(e) => setQuery(e.target.value)}
         onKeyDown={(e) => {
          if (e.key === "Enter") 
            getSearch();
          }}
         />

         <button className="search-btn" onClick={getSearch}>Search</button>

      </div>
      
    </nav>
  );
}
