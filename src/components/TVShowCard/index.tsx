import "./index.scss";
import { TVShow } from "../../types/tvshow";
import StarRating from "../StarRating";

export interface Props {
    tvshow : TVShow
}

export default function TVShowCard(props: Props) {

    const tvshow = props.tvshow;

    return (
        <li className="tv-show-card">
            <div className="tv-show-poster">
                <img src={`https://image.tmdb.org/t/p/original/${tvshow.poster_path}`} 
                alt={tvshow.name} 
                />
            </div>
            <div className="tv-show-infos">
                <p className="tv-show-name">
                    {tvshow.name}
                </p>
                    {tvshow.vote_average > 0 && (
                    <StarRating 
                        rating={tvshow.vote_average} 
                    />
                )}
                <div className="hidden-content">
                    {tvshow.overview && 
                    <p className="tv-show-overview">
                        {tvshow.overview.length > 100
                        ? `${tvshow.overview.substring(0, 100)}...`
                        : tvshow.overview}  
                    </p>
                    }
                    <button className="btn-default">
                        Ver Mais
                    </button>
                </div>
            </div>
                <p className="tv-show-vote-average">
                    {tvshow.vote_average}
                </p>
        </li>
    )
}