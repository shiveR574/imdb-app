export type FavoriteType = "MOVIE" | "TVSHOW" | "PERSON";

export interface FavoriteButtonType {
  type: FavoriteType;
  entityId: string | number;
  entityName?: string;
}