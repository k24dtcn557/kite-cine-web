import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MovieCard.module.css";
import { MovieDto } from "../../types/movie";
import { CommonUtils } from "../../utils/CommonUtils";

interface MovieCardProps {
  movie: MovieDto;
  onBook?: (movieId: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onBook }) => {
  const navigate = useNavigate();
  const handleBook = () => {
    if (movie.id) onBook?.(movie.id.toString());
  };

  const poster = movie.poster;

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      {movie.status === "COMING_SOON" && (
        <div className={styles.dateChip}>
          {CommonUtils.formatDateVN(movie.releaseDate)}
        </div>
      )}
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
            <span className="material-symbols-outlined">local_activity</span>
            ĐẶT VÉ
          </button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
