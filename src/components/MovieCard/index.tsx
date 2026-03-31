import { Movie } from "../../types/movie";
import "./index.scss";
import StarRating from "../StarRating";

export interface Props {
    movie: Movie
}

export default function MovieCard (props: Props){
    const movie = props.movie;
    return (
        <li className="movie-card">
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
                />
            </div>
            <div className="movie-infos">
                <p className="movie-title">
                    {movie.title}
                </p>
                {movie.vote_average > 0 && (
                    <StarRating 
                        rating={movie.vote_average}
                    />
                )}
                <div className="hidden-content">
                    {movie.overview  &&
                        <p className="movie-overview">
                            {movie.overview.length > 100 
                            ? `${movie.overview.substring(0, 100)}...`
                            : movie.overview}
                        </p>
                    }
                    <button className="btn-default">
                        Ver Mais
                    </button>
                </div>
            </div>
                    <p className="movie-vote-average">
                        {movie.vote_average}
                    </p>
        </li>
    )
}