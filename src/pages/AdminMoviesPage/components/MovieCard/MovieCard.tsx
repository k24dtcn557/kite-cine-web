import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import styles from "./MovieCard.module.css";
import {
  MOVIE_STATUS_LABELS,
  MovieStatus,
  movieService,
  MovieDto,
} from "../../../../api/movie.service";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../../../api/types";

interface MovieCardProps {
  movie: MovieDto;
  onRefresh?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onRefresh }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const confirmDeleteMovie = async () => {
    setIsDeleting(true);
    try {
      await movieService.deleteMovie(movie.id);
      toast.success(`Đã xóa phim "${movie.title}"`);
      setIsDeleteModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, `Xóa phim "${movie.title}" thất bại`),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`${styles.movieCard} ${movie.highlighted ? styles.highlightedCard : ""}`}
    >
      <div className={styles.posterWrapper}>
        <img
          src={
            movie.poster ||
            "https://placehold.co/400x600/1E1B1B/FFFFFF?text=No+Poster"
          }
          alt={movie.title}
          className={styles.posterImage}
        />
        <div
          className={`${styles.posterBadge} ${movie.status?.toUpperCase() === MovieStatus.COMING_SOON ? styles.badgeComingSoon : styles.badgeNowShowing}`}
        >
          {MOVIE_STATUS_LABELS[movie.status?.toUpperCase() as MovieStatus] ||
            movie.status}
        </div>
        {movie.highlighted && (
          <div className={styles.highlightBadge}>
            <span className="material-symbols-outlined">star</span> Nổi bật
          </div>
        )}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div>
            <h3
              className={styles.movieTitle}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/admin/movies/${movie.id}/edit`)}
            >
              {movie.title}
            </h3>
            <p className={styles.movieMeta}>
              {movie.genres ? movie.genres.join(", ") : ""}
            </p>
          </div>
          <div className={styles.moreMenuWrapper} ref={menuRef}>
            <button
              className={styles.moreBtn}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
            {isMenuOpen && (
              <div className={styles.dropdownMenu}>
                <button
                  className={styles.dropdownItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    navigate(`/admin/movies/${movie.id}/edit`);
                  }}
                >
                  <span className="material-symbols-outlined">edit</span> Sửa
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    navigate(`/admin/movies/${movie.id}/showtimes`);
                  }}
                >
                  <span className="material-symbols-outlined">
                    calendar_month
                  </span>{" "}
                  Lịch chiếu
                </button>
                <button
                  className={`${styles.dropdownItem} ${styles.danger}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <span className="material-symbols-outlined">delete</span> Xóa
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.cardInfoList}>
          <div className={styles.cardInfoItem}>
            <span className="material-symbols-outlined">schedule</span>
            <span>
              Thời lượng:{" "}
              {movie.runtime
                ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                : "N/A"}
            </span>
          </div>
          <div className={styles.cardInfoItem}>
            <span className="material-symbols-outlined">event</span>
            <span>
              Phát hành:{" "}
              {movie.releaseDate
                ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
                : "N/A"}
            </span>
          </div>
        </div>

        <div className={styles.cardActions}>
          <button
            className={styles.manageBtn}
            onClick={() => navigate(`/admin/movies/${movie.id}/showtimes`)}
          >
            Lịch chiếu
          </button>
          <button className={styles.analyticsBtn}>
            <span className="material-symbols-outlined">bar_chart</span>
          </button>
        </div>
      </div>

      {isDeleteModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{ maxWidth: "400px" }}>
              <h3>Xác nhận xóa</h3>
              <p
                style={{
                  margin: "1rem 0",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Bạn có chắc chắn muốn xóa phim <strong>"{movie.title}"</strong>{" "}
                không?
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className={styles.deleteConfirmBtn}
                  onClick={confirmDeleteMovie}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default MovieCard;
