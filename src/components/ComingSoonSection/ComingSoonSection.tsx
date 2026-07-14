import React from 'react';
import styles from './ComingSoonSection.module.css';
import { COMING_SOON_MOVIES } from '../../data/homeData';
import { ComingSoonMovie } from '../../types/movie';

const FeaturedCard: React.FC<{ movie: ComingSoonMovie }> = ({ movie }) => (
  <div className={`${styles.card} ${styles.cardFeatured}`}>
    <img
      className={styles.cardImg}
      src={movie.imageUrl}
      alt={`${movie.title} coming soon`}
      loading="lazy"
    />
    <div className={styles.cardOverlay}>
      <span className={styles.releaseDate}>{movie.releaseDate}</span>
      <h3 className={`${styles.cardTitle} ${styles.cardTitleLg}`}>{movie.title}</h3>
      {movie.description && (
        <p className={styles.cardDesc}>{movie.description}</p>
      )}
    </div>
  </div>
);

const SideCard: React.FC<{ movie: ComingSoonMovie }> = ({ movie }) => (
  <div className={`${styles.card} ${styles.cardSide}`}>
    <img
      className={styles.cardImg}
      src={movie.imageUrl}
      alt={`${movie.title} coming soon`}
      loading="lazy"
    />
    <div className={styles.cardOverlaySide}>
      <span className={styles.releaseDateSide}>{movie.releaseDate}</span>
      <h3 className={styles.cardTitle}>{movie.title}</h3>
    </div>
  </div>
);

const ComingSoonSection: React.FC = () => {
  const featured = COMING_SOON_MOVIES.find((m) => m.featured);
  const side = COMING_SOON_MOVIES.filter((m) => !m.featured);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Section header */}
        <div className={styles.header}>
          <div>
            <span className={styles.label}>ANTICIPATED RELEASES</span>
            <h2 className={styles.heading}>Coming Soon</h2>
          </div>
          <button className={styles.viewAll}>
            View All
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        {/* Bento grid */}
        <div className={styles.bentoGrid}>
          {featured && <FeaturedCard movie={featured} />}
          <div className={styles.sideCards}>
            {side.map((movie) => (
              <SideCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
