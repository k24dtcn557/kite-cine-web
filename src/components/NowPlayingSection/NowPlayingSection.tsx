import React, { useState, useCallback, useEffect } from "react";
import styles from "./NowPlayingSection.module.css";
import MovieCarousel from "../MovieCarousel";
import { movieService } from "../../services/movie.service";
import { MovieDto, GENRE_FILTERS } from "../../types/movie";

const NowPlayingSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("Tất Cả");
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const genreParam = activeFilter === "Tất Cả" ? undefined : activeFilter;
        const nowShowing = await movieService.getNowShowingMovies(genreParam);
        setMovies(nowShowing || []);
      } catch (error) {
        console.error("Failed to fetch now showing movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [activeFilter]);

  const handleBook = useCallback((movieId: string) => {
    // TODO: navigate to booking flow
    console.log("Book movie:", movieId);
  }, []);

  return (
    <section id="now-playing" className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.heading}>Phim Đang Chiếu</h2>
        <div className={styles.filters} role="group" aria-label="Genre filters">
          {GENRE_FILTERS.map((filter) => (
            <button
              key={filter}
              className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Grid */}
      <div className={`${styles.grid} ${loading ? styles.gridLoading : ""}`}>
        {movies.length > 0 ? (
          <MovieCarousel movies={movies} onBook={handleBook} />
        ) : loading ? (
          <div className={styles.loader}>
            <div className={styles.spinner} />
            <p>Đang tải phim...</p>
          </div>
        ) : (
          <p className={styles.emptyState}>
            Không tìm thấy phim nào cho thể loại này.
          </p>
        )}
      </div>
    </section>
  );
};

export default NowPlayingSection;
