import React, { useState } from 'react';
import styles from './TheaterLocator.module.css';

const MAP_IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtgEX7b7r3anqSq5wHxBrT0_Cas70UUhDoildFDIvh0UXn4WTaXLUbBRP-Z-mRzIFG8HLtbWlWJt_8oupaCjtjGH5NWfItAcEDMLcrqmW5zauS-bDurOAFKTcE2TNvmA4TEO8w5LiWCIvCs5s4ZuCEhtC_KQ_vTnkKWxaz-NJvtH5UhcLHBgSohmBN90RUTg2YreS_2DJw31WyhZAg1AOD8g6mcHBbGeuO4KQCVvCoW5LL85qr62bD84OxDJ9YTi9RIQ_BIkmTCZM';

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
              src={MAP_IMAGE_URL}
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
