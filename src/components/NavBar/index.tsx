"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../NavBar/index.scss";
import dicaprio from "../../assets/dicaprio.jpg";
import Search from "../../assets/search.png";
// import IMDB from "../../assets/imdb.png";
// import axios from "axios";
// import { Movie } from "../../types/movie";
// import MovieCard from "../MovieCard";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  
  const{data: session}:any = useSession();

  const getSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* <h1 className="navbar-title">IMDB</h1> */}
        {/*<Image src={IMDB} alt="IMDB Logo" className="logo-pic" priority />*/}

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link href="/"  className={pathname === "/" ? "active" : ""} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link  href="/movies" className={pathname === "/movies" ? "active" : ""} onClick={() => setMenuOpen(false)}>Movies</Link>
          <Link  href="/tv-shows" className={pathname === "/tv-shows" ? "active" : ""} onClick={() => setMenuOpen(false)}>TV Shows</Link>
          <Link  href="/people" className={pathname === "/people" ? "active" : ""} onClick={() => setMenuOpen(false)}>People</Link>
          {session && (
          <Link  href="/favorites" className={pathname === "/favorites" ? "active" : ""} onClick={() => setMenuOpen(false)}>Favorites</Link>
          )}
        </div>
        <div className="right-section">
          {!session ? (
            <>
        <div className="registration-links">
          <Link href="/login" className={pathname === "/login" ? "active" : ""} onClick={() => setMenuOpen(false)}>Login</Link>
          <Link href="/register" className={pathname === "/register" ? "active" : ""} onClick={() => setMenuOpen(false)}>Register</Link>
        </div>
            </>
          ):(
            <>
            <li>
              <button
              onClick={() => {
                signOut();
                setMenuOpen(false);
              }}
              className="logout-btn"
              >
                Logout
              </button> 
            </li>
            </>
          )}

        <div className="greeting-content">
          <Image src={dicaprio} alt="Profile Picture" className="profile-pic" />
          <div className="greeting-text-group">
            <p className="greeting-text">Welcome Back</p>
            <p className="greeting-text2">
              {session?.user?.email ?? "Dicaprio"}
              </p>
          </div>
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

         <Image src={Search} alt="Search" className="search-btn" onClick={getSearch} />

      </div>
      
    </nav>
  );
}
