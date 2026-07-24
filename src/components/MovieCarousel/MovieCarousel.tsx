import React, { useRef } from "react";
import styles from "./MovieCarousel.module.css";
import { MovieDto } from "../../types/movie";
import MovieCard from "../MovieCard";

interface MovieCarouselProps {
  movies: MovieDto[];
  onBook?: (movieId: string) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, onBook }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.container}>
      {movies.length > 3 && (
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
      )}

      <div className={styles.scrollArea} ref={scrollRef}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.slide}>
            <MovieCard movie={movie} onBook={onBook} />
          </div>
        ))}
      </div>

      {movies.length > 3 && (
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      )}
    </div>
  );
};

export default MovieCarousel;
