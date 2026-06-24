import { People } from "./people";

export interface KnownFor {
    id: number;
    title?: string;   // filmes
    name?: string;    // séries
}

export interface CombinedCredit {
    id: number;
    title?: string;          // movies
    name?: string;           // tv shows
    media_type: "movie" | "tv";
    character?: string;
    job?: string;
    poster_path: string | null;
    release_date?: string;
    first_air_date?: string;
    popularity: number;
    overview: string,
    vote_average: number,
}

export interface PeopleDetails {
    id: number,
    name: string,
    known_for_department: string,
    profile_path: string,
    poster_path: string,
    known_for?: KnownFor[],
    character?: string,  // credits.cast
    job?: string,     // credits.crew
    place_of_birth?: string,
    gender?: number,
    birthday?: string,
    deathday?: string,
    biography?: string,
    popularity?: number,
    combined_credits: {
        cast: CombinedCredit[],
        crew: CombinedCredit[],
    };
}