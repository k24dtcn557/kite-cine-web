import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MovieCard.module.css";
import { MovieDto } from "../../api/movie.service";

interface MovieCardProps {
  movie: MovieDto;
  onBook?: (movieId: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onBook }) => {
  const navigate = useNavigate();
  const handleBook = () => {
    if (movie.id) onBook?.(movie.id.toString());
  };

  const poster =
    movie.poster || "https://placehold.co/400x600/1E1B1B/FFFFFF?text=No+Poster";
  const rating = "8.5"; // Hardcoded default as API doesn't provide this yet
  const genre =
    movie.genres && movie.genres.length > 0 ? movie.genres[0] : "Chưa rõ";

  return (
    <article className={styles.card} onClick={() => navigate(`/movies/${movie.id}`)}>
      <img
        className={styles.poster}
        src={poster}
        alt={`${movie.title} movie poster`}
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className={styles.overlay}>
        <div className={styles.info}>
          <button
            className={styles.bookBtn}
            onClick={handleBook}
            aria-label={`Đặt vé cho ${movie.title}`}
          >
            ĐẶT VÉ
          </button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
