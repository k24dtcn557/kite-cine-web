import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./MovieDetailsPage.module.css";
import { Navbar, Footer } from "../../components";
import MovieSynopsis from "./components/MovieSynopsis";
import MovieShowtimes from "./components/MovieShowtimes";
import { movieService, MovieDto, CrewMemberDto } from "../../api/movie.service";

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDto | null>(null);
  const [crew, setCrew] = useState<CrewMemberDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when loading a new movie
    window.scrollTo(0, 0);

    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const movieId = parseInt(id, 10);

        if (isNaN(movieId)) {
          throw new Error("Invalid movie ID");
        }

        const [movieData, crewData] = await Promise.all([
          movieService.viewMovieById(movieId),
          movieService.viewMovieCrewMembers(movieId).catch(() => []),
        ]);

        setMovie(movieData);
        setCrew(crewData || []);
      } catch (err) {
        console.error("Failed to load movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <div className={styles.loadingText}>Đang tải...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.errorState}>
          <span className={`material-symbols-outlined ${styles.errorIcon}`}>
            movie_off
          </span>
          <h2 className={styles.errorTitle}>Không tìm thấy phim</h2>
          <p className={styles.errorDesc}>
            {error || "Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}
          </p>
          <button onClick={() => navigate("/")} className={styles.homeBtn}>
            <span className="material-symbols-outlined">home</span>
            Về Trang Chủ
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <MovieSynopsis movie={movie} crew={crew} />
        <MovieShowtimes movieId={movie.id} movie={movie} />
      </main>
      <Footer />
    </div>
  );
};

export default MovieDetailsPage;
