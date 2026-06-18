export interface KnownFor {
    id: number;
    title?: string;   // filmes
    name?: string;    // séries
}

export interface People {
    id: number,
    name: string,
    known_for_department: string,
    profile_path: string,
    known_for?: KnownFor[],
}