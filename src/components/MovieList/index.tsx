import "./index.scss";

export default function MovieList (){
    return (
        <ul>
            <li className="movie-card">
                <h2 className="movie-title">Movie Title</h2>
                <p className="movie-description">This is a brief description of the movie. It gives an overview of the plot and main themes.</p>
                <p className="movie-rating">Rating: 8.5/10</p>
            </li>
        </ul>
    )
}

