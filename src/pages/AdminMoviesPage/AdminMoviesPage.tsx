import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminMoviesPage.module.css";
import { MovieCard } from "./components";
import { movieService } from "../../services/movie.service";
import { MovieDto } from "../../types/movie";

const FILTER_TABS = [
  "Tất cả",
  "Nổi bật",
  "Đang chiếu",
  "Sắp chiếu",
  "Dừng chiếu",
  "Bản nháp",
];

const getStatusQuery = (tab: string) => {
  if (tab === "Đang chiếu") return "NOW_SHOWING";
  if (tab === "Sắp chiếu") return "COMING_SOON";
  if (tab === "Dừng chiếu") return "ARCHIVED";
  if (tab === "Bản nháp") return "DRAFT";
  return undefined;
};

const AdminMoviesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const result = await movieService.searchMovies({
        page: currentPage,
        size: 10,
        status: getStatusQuery(activeTab),
        highlighted: activeTab === "Nổi bật" ? true : undefined,
      });

      setTotalPages(result.totalPages);
      setMovies(result.data || []);
    } catch (error) {
      console.error("Failed to fetch movies", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Danh sách phim</h2>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => navigate("/admin/movies/new")}
        >
          <span className="material-symbols-outlined">add</span>
          Thêm phim mới
        </button>
      </div>
      {/* Filters Row */}
      <div className={styles.filtersRow}>
        <div className={styles.filterTabs}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.filterTab} ${activeTab === tab ? styles.filterTabActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.filterSelects}>
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              disabled={loading || currentPage === 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className={styles.pageInfo}>
              Trang {currentPage + 1} / {Math.max(1, totalPages)}
            </span>
            <button
              className={styles.pageBtn}
              disabled={loading || currentPage >= Math.max(0, totalPages - 1)}
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(Math.max(0, totalPages - 1), p + 1),
                )
              }
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className={styles.moviesGrid}>
        {loading ? (
          <div className={styles.loadingState}>
            <span className={`material-symbols-outlined ${styles.spinner}`}>
              sync
            </span>
            <p>Đang tải phim...</p>
          </div>
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRefresh={() => fetchMovies()}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
              movie_filter
            </span>
            <p className={styles.emptyText}>Không tìm thấy phim nào.</p>
            <p className={styles.emptySubtext}>
              Vui lòng thử thay đổi bộ lọc hoặc thêm phim mới.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMoviesPage;
