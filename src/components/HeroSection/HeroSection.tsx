import React from 'react';
import styles from './HeroSection.module.css';
import { HERO_MOVIE } from '../../data/homeData';

const HeroSection: React.FC = () => {
  const { title, tagline, rating, description, genres, backdropUrl } = HERO_MOVIE;

  return (
    <section className={styles.hero}>
      {/* Backdrop */}
      <div className={styles.backdrop}>
        <div
          className={styles.backdropImg}
          style={{ backgroundImage: `url('${backdropUrl}')` }}
          role="img"
          aria-label="Stellaris: Void Protocol movie backdrop"
        />
        <div className={styles.gradientLeft} />
        <div className={styles.gradientBottom} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.contentInner}>
          {/* Meta badges */}
          <div className={styles.meta}>
            <span className={styles.trendingBadge}>{tagline}</span>
            <div className={styles.rating}>
              <span className={`material-symbols-outlined icon-filled ${styles.starIcon}`}>
                star
              </span>
              <span className={styles.ratingValue}>{rating}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className={styles.title}>
            {title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          {/* Description */}
          <p className={styles.description}>{description}</p>

          {/* Genre pills */}
          <div className={styles.genres}>
            {genres.map((genre) => (
              <span key={genre} className={styles.genrePill}>
                {genre}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className={styles.ctas}>
            <button className={styles.btnPrimary}>
              <span className="material-symbols-outlined">confirmation_number</span>
              BOOK NOW
            </button>
            <button className={styles.btnSecondary}>
              <span className="material-symbols-outlined">play_circle</span>
              WATCH TRAILER
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
