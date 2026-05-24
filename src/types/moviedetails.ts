import { Movie } from "./movie";

export interface MovieDetails {
    id: number,
    title: string,
    overview: string,
    poster_path: string,
    backdrop_path: string,
    vote_average: number,
    release_date: string,
    runtime: number,
    genres: { id: number, name: string }[],
    tagline: string,
    status: string,
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
        results: Movie[],
    };
}