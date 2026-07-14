import React from 'react';
import styles from './MovieCard.module.css';
import { Movie } from '../../types/movie';

interface MovieCardProps {
  movie: Movie;
  onBook?: (movieId: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onBook }) => {
  const handleBook = () => onBook?.(movie.id);

  return (
    <article className={styles.card}>
      <img
        className={styles.poster}
        src={movie.posterUrl}
        alt={`${movie.title} movie poster`}
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className={styles.overlay}>
        <div className={styles.info}>
          <h3 className={styles.title}>{movie.title}</h3>
          <div className={styles.meta}>
            <div className={styles.rating}>
              <span className={`material-symbols-outlined icon-filled ${styles.starIcon}`}>
                star
              </span>
              <span>{movie.rating}</span>
            </div>
            <span className={styles.genre}>{movie.genre}</span>
          </div>
          <button
            className={styles.bookBtn}
            onClick={handleBook}
            aria-label={`Book tickets for ${movie.title}`}
          >
            BOOK NOW
          </button>
        </div>
      </div>

      {/* Format badges */}
      {movie.badges && movie.badges.length > 0 && (
        <div className={styles.badges}>
          {movie.badges.map((badge) => (
            <span key={badge} className={styles.badge}>
              {badge}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default MovieCard;
