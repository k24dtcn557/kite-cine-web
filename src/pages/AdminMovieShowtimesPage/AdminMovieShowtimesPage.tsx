import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AdminMovieShowtimesPage.module.css";
import { movieService } from "../../services/movie.service";
import { MovieDto } from "../../types/movie";
import toast from "react-hot-toast";

import { showTimeService } from "../../services/show-time.service";
import { CinemaShowtimesDto } from "../../types/showtime";

const AdminMovieShowtimesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [cinemaShowtimes, setCinemaShowtimes] = useState<CinemaShowtimesDto[]>(
    [],
  );

  // Generate 14 days for the weekly preview
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const getDayName = (date: Date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (!id) return;
        const data = await movieService.getMovieById(parseInt(id));
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie", error);
        toast.error("Không thể tải thông tin phim");
        navigate("/admin/movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, navigate]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        if (!id) return;
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const dd = String(selectedDate.getDate()).padStart(2, "0");
        const dateString = `${yyyy}-${mm}-${dd}`;

        const data = await showTimeService.getShowTimesByMovieAndDate(
          parseInt(id),
          dateString,
        );
        setCinemaShowtimes(data || []);
      } catch (error) {
        console.error("Failed to fetch showtimes", error);
        toast.error("Không thể tải lịch chiếu");
      }
    };
    fetchShowtimes();
  }, [id, selectedDate]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <span className={`material-symbols-outlined ${styles.spinner}`}>
          sync
        </span>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <nav className={styles.breadcrumb}>
            <span
              className={styles.breadcrumbLink}
              onClick={() => navigate("/admin/movies")}
            >
              Danh sách Phim
            </span>
            <span
              className={`material-symbols-outlined ${styles.breadcrumbIcon}`}
            >
              chevron_right
            </span>
            <span className={styles.breadcrumbCurrent}>Lịch chiếu</span>
          </nav>
          <h1 className={styles.title}>Quản lý Lịch chiếu</h1>
        </div>
        <button
          className={styles.saveBtn}
          onClick={() => navigate(`/admin/movies/${id}/showtimes/add`)}
        >
          Thêm Lịch chiếu
        </button>
      </div>

      <div className={styles.grid}>
        {/* Left Column: Context & Config */}
        <div className={styles.leftCol}>
          {/* Movie Context */}
          <div className={styles.movieCard}>
            <img
              src={movie.poster}
              alt={movie.title}
              className={styles.moviePoster}
            />
            <div className={styles.movieInfo}>
              <h3>{movie.title}</h3>
              <p>{movie.runtime} phút</p>
            </div>
          </div>
        </div>

        {/* Right Column: Slot Manager */}
        <div className={styles.rightCol}>
          {/* Date Selector Section */}
          <div className={styles.dateSection}>
            <h2 className={styles.sectionTitle}>Chọn ngày</h2>
            <div className={styles.dateScroller}>
              {dates.map((date, idx) => {
                const isSelected =
                  selectedDate.getDate() === date.getDate() &&
                  selectedDate.getMonth() === date.getMonth();
                return (
                  <div
                    key={idx}
                    className={`${styles.dateItem} ${isSelected ? styles.dateItemSelected : ""}`}
                    onClick={() => handleDateSelect(date)}
                  >
                    <span className={styles.dayName}>{getDayName(date)}</span>
                    <span className={styles.dayNumber}>
                      {date.getDate()}
                      <span className={styles.monthName}>
                        /{date.getMonth() + 1}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cinema Showtimes List - Full Width */}
      <div className={styles.cinemaList}>
        {cinemaShowtimes.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
              event_busy
            </span>
            <p>Không có suất chiếu nào vào ngày này.</p>
          </div>
        ) : (
          cinemaShowtimes.map((cinema) => (
            <div key={cinema.id} className={styles.cinemaGroup}>
              <h3 className={styles.cinemaName}>{cinema.name}</h3>
              <div className={styles.auditoriumList}>
                {cinema.auditoriums.map((auditorium) => (
                  <div key={auditorium.id} className={styles.auditoriumGroup}>
                    <h4 className={styles.auditoriumName}>{auditorium.name}</h4>
                    <div className={styles.showtimeChips}>
                      {auditorium.showTimes.map((st) => (
                        <div key={st.id} className={styles.timeChip}>
                          {st.startTime
                            ? st.startTime.substring(0, 5)
                            : "00:00"}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMovieShowtimesPage;
