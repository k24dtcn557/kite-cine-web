import React, { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";
import { movieService } from "../../api/movie.service";
import { MovieDto } from "../../api/movie.service";

const HeroSection: React.FC = () => {
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const highlighted = await movieService.getHighlightedMovies();
        if (highlighted && highlighted.length > 0) {
          setMovies(highlighted);
        }
      } catch (error) {
        console.error("Failed to fetch highlighted movies:", error);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  // Fallback to static hero if no highlighted movies exist
  const currentMovie = movies.length > 0 ? movies[currentIndex] : null;

  const displayData = currentMovie
    ? {
        title: currentMovie.title || "",
        tagline: currentMovie.tagline || "HIGHLIGHTED",
        description: currentMovie.description || "",
        genres: currentMovie.genres || [],
        backdropUrl:
          currentMovie.background ||
          currentMovie.poster ||
          "https://placehold.co/1920x1080/1E1B1B/FFFFFF?text=No+Background",
        // Default rating since missing from dto
        rating: "8.5",
      }
    : null;

  if (!displayData) {
    return <section className={styles.hero} />;
  }

  return (
    <section className={styles.hero}>
      {/* Backdrop */}
      <div className={styles.backdrop}>
        <div
          className={styles.ambientImg}
          style={{ backgroundImage: `url('${displayData.backdropUrl}')` }}
        />
        <div
          className={styles.backdropImg}
          style={{ backgroundImage: `url('${displayData.backdropUrl}')` }}
          role="img"
          aria-label={`${displayData.title} movie backdrop`}
        />
      </div>

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + movies.length) % movies.length,
              )
            }
            aria-label="Previous slide"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % movies.length)
            }
            aria-label="Next slide"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Carousel Dots */}
          <div className={styles.dots}>
            {movies.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;
