import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ComingSoonSection.module.css";
import { movieService } from "../../services/movie.service";
import { MovieDto } from "../../types/movie";
import MovieCarousel from "../MovieCarousel";
import { CommonUtils } from "../../utils/CommonUtils";

const FeaturedCard: React.FC<{ movie: MovieDto }> = ({ movie }) => {
  const navigate = useNavigate();
  const imageUrl = movie.background || movie.poster;
  return (
    <div
      className={`${styles.card} ${styles.cardFeatured}`}
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      <img
        className={styles.cardImg}
        src={imageUrl}
        alt={`${movie.title} coming soon`}
        loading="lazy"
      />
      <div className={styles.dateChip}>
        {CommonUtils.formatDateVN(movie.releaseDate)}
      </div>
      <div className={styles.cardOverlay}>
        <div className={styles.info}>
          <h3 className={`${styles.cardTitle} ${styles.cardTitleLg}`}>
            {movie.title}
          </h3>
          <button
            className={styles.bookBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movies/${movie.id}`);
            }}
            aria-label={`Đặt vé cho ${movie.title}`}
          >
            <span className="material-symbols-outlined">local_activity</span>
            ĐẶT VÉ
          </button>
        </div>
      </div>
    </div>
  );
};

const SideCard: React.FC<{ movie: MovieDto }> = ({ movie }) => {
  const navigate = useNavigate();
  const imageUrl = movie.background || movie.poster;
  return (
    <div
      className={`${styles.card} ${styles.cardSide}`}
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      <img
        className={styles.cardImg}
        src={imageUrl}
        alt={`${movie.title} coming soon`}
        loading="lazy"
      />
      <div className={styles.dateChip}>
        {CommonUtils.formatDateVN(movie.releaseDate)}
      </div>
      <div className={styles.cardOverlaySide}>
        <div className={styles.info}>
          <h3 className={styles.cardTitle}>{movie.title}</h3>
          <button
            className={styles.bookBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movies/${movie.id}`);
            }}
            aria-label={`Đặt vé`}
          >
            <span className="material-symbols-outlined">local_activity</span>
            ĐẶT VÉ
          </button>
        </div>
      </div>
    </div>
  );
};

const ComingSoonSection: React.FC = () => {
  const [movies, setMovies] = useState<MovieDto[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const comingSoon = await movieService.getComingSoonMovies();
        setMovies(comingSoon || []);
      } catch (error) {
        console.error("Failed to fetch coming soon movies:", error);
      }
    };
    fetchMovies();
  }, []);

  const featured = movies.length > 0 ? movies[0] : null;
  const side = movies.slice(1, 2);
  const rest = movies.slice(2);

  return (
    <section id="coming-soon" className={styles.section}>
      <div className={styles.inner}>
        {/* Section header */}
        <div className={styles.header}>
          <div>
            <span className={styles.label}>PHIM MỚI SẮP RA MẮT</span>
            <h2 className={styles.heading}>Sắp Chiếu</h2>
          </div>
        </div>

        {/* Bento grid */}
        {movies.length > 0 ? (
          <>
            <div className={styles.bentoGrid}>
              {featured && <FeaturedCard movie={featured} />}
              <div className={styles.sideCards}>
                {side.map((movie) => (
                  <SideCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
            {rest.length > 0 && (
              <div style={{ marginTop: "3rem" }}>
                <h3
                  style={{
                    color: "var(--color-on-surface)",
                    marginBottom: "1rem",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Phim Sắp Chiếu Khác
                </h3>
                <MovieCarousel movies={rest} />
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "var(--color-on-surface-variant)" }}>
            Hiện tại không có phim sắp chiếu.
          </p>
        )}
      </div>
    </section>
  );
};

export default ComingSoonSection;
