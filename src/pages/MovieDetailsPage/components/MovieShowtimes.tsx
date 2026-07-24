import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MovieShowtimes.module.css";
import { showTimeService } from "../../../services/show-time.service";
import { CinemaShowtimesDto } from "../../../types/showtime";
import { MovieDto } from "../../../types/movie";

interface Props {
  movieId: number;
  movie: MovieDto;
}

const MovieShowtimes: React.FC<Props> = ({ movieId, movie }) => {
  const navigate = useNavigate();
  // Generate 14 days for the date picker
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const getDayName = (date: Date, index: number) => {
    if (index === 0) return "Hôm nay";
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };

  const [activeDate, setActiveDate] = useState<Date>(dates[0]);
  const [cinemaShowtimes, setCinemaShowtimes] = useState<CinemaShowtimesDto[]>(
    [],
  );

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const yyyy = activeDate.getFullYear();
        const mm = String(activeDate.getMonth() + 1).padStart(2, "0");
        const dd = String(activeDate.getDate()).padStart(2, "0");
        const dateString = `${yyyy}-${mm}-${dd}`;

        const data = await showTimeService.getPublicShowTimesByMovieAndDate(
          movieId,
          dateString,
        );
        setCinemaShowtimes(data || []);
      } catch (error) {
        console.error("Failed to fetch showtimes", error);
      }
    };
    fetchShowtimes();
  }, [movieId, activeDate]);

  const handleDateSelect = (date: Date) => {
    setActiveDate(date);
  };

  return (
    <section id="showtimes" className={styles.section}>
      <h2 className={styles.heading}>Lịch Chiếu Phim</h2>

      {/* Date Picker */}
      <div className={styles.datePicker}>
        {dates.map((date, idx) => {
          const isSelected =
            activeDate.getDate() === date.getDate() &&
            activeDate.getMonth() === date.getMonth();
          return (
            <button
              key={idx}
              className={`${styles.dateBtn} ${
                isSelected ? styles.dateBtnActive : ""
              }`}
              onClick={() => handleDateSelect(date)}
              aria-pressed={isSelected}
            >
              <span className={styles.dayLabel}>{getDayName(date, idx)}</span>
              <span className={styles.dateLabel}>{date.getDate()}</span>
              <span className={styles.monthLabel}>Th{date.getMonth() + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Theater Groups */}
      <div className={styles.theatersList}>
        {cinemaShowtimes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--color-on-surface-variant)",
            }}
          >
            <p>Không có suất chiếu nào vào ngày này.</p>
          </div>
        ) : (
          cinemaShowtimes.map((cinema) => (
            <div key={cinema.id} className={styles.theaterCard}>
              <div className={styles.theaterHeader}>
                <div>
                  <h3 className={styles.theaterName}>{cinema.name}</h3>
                  <div className={styles.theaterLocation}>
                    <span
                      className={`material-symbols-outlined ${styles.locationIcon}`}
                    >
                      location_on
                    </span>
                    {cinema.address}
                  </div>
                </div>
                <button
                  className={styles.infoBtn}
                  aria-label="Theater Information"
                >
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>

              {cinema.auditoriums.map((auditorium, idx) => (
                <React.Fragment key={auditorium.id}>
                  {idx > 0 && <div className={styles.divider} />}
                  <div className={styles.showtimeRow}>
                    <div className={styles.formatLabel}>
                      {auditorium.type || auditorium.name}
                    </div>
                    <div className={styles.timesGrid}>
                      {auditorium.showTimes.map((st) => (
                        <button
                          key={st.id}
                          className={styles.timeBtn}
                          onClick={() =>
                            navigate(`/booking/${st.id}`, {
                              state: {
                                movie,
                                cinemaName: cinema.name,
                                cinemaAddress: cinema.address,
                                auditoriumId: auditorium.id,
                                auditoriumName: auditorium.name,
                                showtime: {
                                  ...st,
                                  date: st.date,
                                },
                              },
                            })
                          }
                        >
                          {st.startTime
                            ? st.startTime.substring(0, 5)
                            : "00:00"}
                        </button>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default MovieShowtimes;
