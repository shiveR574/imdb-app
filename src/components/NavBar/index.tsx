import "../NavBar/index.scss";
import dicaprio from "../../assets/dicaprio.jpg";
import Image from "next/image";

export default function NavBar() {
  return (
    <nav className="navbar-container">
        <div className="navbar-content">
            <h1 className="navbar-title">IMDB</h1>
            <div className="greeting-content">
                <Image src={dicaprio} alt="Profile Picture" className="profile-pic" />
                <div className="greeting-text-group">
                    <p className="greeting-text">Welcome Back</p>
                    <p className="greeting-text2">DiCaprio</p>
                </div>
            </div>
        </div>
        <div className="search-bar">
            <input type="text" placeholder="Search for movies or TV shows..." />
        </div>
    </nav>
  );
}
