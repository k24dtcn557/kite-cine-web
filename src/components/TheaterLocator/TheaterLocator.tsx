import React, { useState } from 'react';
import styles from './TheaterLocator.module.css';
import { HERO_MOVIE } from '../../data/homeData';

const TheaterLocator: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement theater search logic
    console.log('Search theaters near:', query);
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.card}>
          {/* Background decoration */}
          <div className={styles.decoration} aria-hidden="true" />

          {/* Text content */}
          <div className={styles.content}>
            <h2 className={styles.heading}>Find Your Nearest Cineplex</h2>
            <p className={styles.description}>
              Experience movies the way they were meant to be seen. Locate a theater near you
              and check the latest showtimes.
            </p>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <div className={styles.inputWrapper}>
                <span className={`material-symbols-outlined ${styles.locationIcon}`}>
                  location_on
                </span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Enter your city or zip code"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="City or zip code"
                />
              </div>
              <button type="submit" className={styles.searchBtn}>
                SEARCH
              </button>
            </form>
          </div>

          {/* Map image */}
          <div className={styles.mapWrapper}>
            <img
              className={styles.mapImg}
              src={HERO_MOVIE.mapImageUrl}
              alt="Map showing nearby Cineplex theater locations"
              loading="lazy"
            />
            <div className={styles.mapOverlay} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheaterLocator;
