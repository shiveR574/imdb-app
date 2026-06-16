import {TVShow} from "./tvshow";

export interface TVShowDetails {
    id: number,
    name: string,
    overview: string,
    poster_path: string,
    backdrop_path: string,
    vote_average: number,
    release_date: string,
    episode_runtime: number[],
    first_air_date: string,
    genres: { id: number, name: string }[],
    in_production: boolean,
    status: string,
    tagline: string,
    last_air_date: string,
    number_of_episodes: number,
    number_of_seasons: number,
    credits: {
        cast: {
            id: number,
            name: string,
            character: string,
            profile_path: string,
            known_for_department: string,
        }[],
        crew: {
            id: number,
            name: string,
            job: string,
            profile_path: string,
            known_for_department: string,
        }[],
    };
    videos: {
            results: {
                key: string,
                type: string,
                site: string,        
            }[],
        };
        similar: {
            results: TVShow[],
        };
}