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

  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [movies]);

  const scrollLeftAction = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRightAction = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.container}>
      {movies.length > 3 && canScrollLeft && (
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={scrollLeftAction}
          aria-label="Scroll left"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
      )}

      <div className={styles.scrollArea} ref={scrollRef} onScroll={checkScroll}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.slide}>
            <MovieCard movie={movie} onBook={onBook} />
          </div>
        ))}
      </div>

      {movies.length > 3 && canScrollRight && (
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={scrollRightAction}
          aria-label="Scroll right"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      )}
    </div>
  );
};

export default MovieCarousel;
