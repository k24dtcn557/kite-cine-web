import React, { useState, useCallback } from 'react';
import styles from './NowPlayingSection.module.css';
import MovieCard from '../MovieCard';
import { NOW_PLAYING_MOVIES, GENRE_FILTERS } from '../../data/homeData';
import { GenreFilter } from '../../types/movie';

const NowPlayingSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<GenreFilter>('All Movies');

  const filteredMovies = activeFilter === 'All Movies'
    ? NOW_PLAYING_MOVIES
    : NOW_PLAYING_MOVIES.filter((m) => m.genre === activeFilter);

  const handleBook = useCallback((movieId: string) => {
    // TODO: navigate to booking flow
    console.log('Book movie:', movieId);
  }, []);

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.heading}>Now Playing</h2>
        <div className={styles.filters} role="group" aria-label="Genre filters">
          {GENRE_FILTERS.map((filter) => (
            <button
              key={filter}
              className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Grid */}
      <div className={styles.grid}>
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onBook={handleBook} />
        ))}
        {filteredMovies.length === 0 && (
          <p className={styles.emptyState}>No movies found for this genre.</p>
        )}
      </div>
    </section>
  );
};

export default NowPlayingSection;
