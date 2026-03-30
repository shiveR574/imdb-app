import "../NavBar/index.scss";

export default function NavBar() {
  return (
    <nav className="navbar-container">
        <div className="navbar-content">
            <h1 className="navbar-title">IMDB APP</h1>
            <div className="search-bar">
                <input type="text" placeholder="Search movies or TV shows..." />
            </div>
            <div className="greeting-content">
                <p className="greeting-text">Welcome Back</p>
                <p className="greeting-text2">Brito</p>
            </div>
        </div>
    </nav>
  );
}
