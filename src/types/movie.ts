export interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  posterUrl: string;
  badges?: string[];
}

export interface ComingSoonMovie {
  id: string;
  title: string;
  releaseDate: string;
  imageUrl: string;
  description?: string;
  featured?: boolean;
}

export type GenreFilter =
  | 'All Movies'
  | 'Action'
  | 'Drama'
  | 'Horror'
  | 'Sci-Fi'
  | 'Comedy';
