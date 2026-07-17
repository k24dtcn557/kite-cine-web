import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MovieCard.module.css';

export interface MovieData {
  id: number;
  title: string;
  genre: string;
  duration: string;
  year: string;
  posterUrl: string;
  status: string;
  ticketSales: string;
  salesGrowth: string;
  imdbRating: string;
}

interface MovieCardProps {
  movie: MovieData;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.movieCard}>
      <div className={styles.posterWrapper}>
        <img src={movie.posterUrl} alt={movie.title} className={styles.posterImage} />
        <div className={`${styles.posterBadge} ${movie.status === 'COMING SOON' ? styles.badgeComingSoon : styles.badgeNowShowing}`}>
          {movie.status}
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div>
            <h3 
              className={styles.movieTitle} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/admin/movies/${movie.id}/edit`)}
            >
              {movie.title}
            </h3>
            <p className={styles.movieMeta}>
              {movie.genre} • {movie.duration} • {movie.year}
            </p>
          </div>
          <button className={styles.moreBtn} onClick={() => navigate(`/admin/movies/${movie.id}/edit`)}>
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
        
        <div className={styles.cardStatsGrid}>
          <div className={styles.statBox}>
            <p className={styles.statBoxLabel}>Ticket Sales</p>
            <div className={styles.statBoxValueGroup}>
              <p className={styles.statBoxValue}>{movie.ticketSales}</p>
              {movie.salesGrowth !== "0%" && (
                <span className={styles.statBoxGrowth}>{movie.salesGrowth}</span>
              )}
            </div>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statBoxLabel}>IMDb Rating</p>
            <div className={styles.statBoxValueGroup}>
              <p className={styles.statBoxValue}>{movie.imdbRating}</p>
              {movie.imdbRating !== "N/A" && (
                <span className={`material-symbols-outlined ${styles.starIcon}`}>star</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.cardActions}>
          <button className={styles.manageBtn}>Manage Showtimes</button>
          <button className={styles.analyticsBtn}>
            <span className="material-symbols-outlined">bar_chart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
