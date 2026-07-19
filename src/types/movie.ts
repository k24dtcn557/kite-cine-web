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
