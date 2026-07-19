import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AdminMovieShowtimesPage.module.css";
import { movieService, MovieDto } from "../../api/movie.service";
import toast from "react-hot-toast";

// Mock Data Types for Showtimes (Since API isn't built yet)
interface ShowtimeSlot {
  id: string;
  time: string;
  isImax: boolean;
  is3d: boolean;
  isRecurring: boolean;
  price: number;
}

const MOCK_SLOTS: ShowtimeSlot[] = [
  { id: "1", time: "14:30", isImax: true, is3d: true, isRecurring: true, price: 18.5 },
  { id: "2", time: "18:00", isImax: false, is3d: false, isRecurring: false, price: 12.0 },
  { id: "3", time: "21:15", isImax: true, is3d: false, isRecurring: true, price: 15.0 },
];

const AdminMovieShowtimesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<ShowtimeSlot[]>(MOCK_SLOTS);

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

  const handleSave = () => {
    toast.success("Đã lưu cấu hình lịch chiếu (Mock)!");
  };

  const toggleRecurring = (slotId: string) => {
    setSlots(slots.map(s => s.id === slotId ? { ...s, isRecurring: !s.isRecurring } : s));
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <span className={`material-symbols-outlined ${styles.spinner}`}>sync</span>
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
            <span className={styles.breadcrumbLink} onClick={() => navigate("/admin")}>Admin</span>
            <span className={`material-symbols-outlined ${styles.breadcrumbIcon}`}>chevron_right</span>
            <span className={styles.breadcrumbLink} onClick={() => navigate("/admin/movies")}>Movies</span>
            <span className={`material-symbols-outlined ${styles.breadcrumbIcon}`}>chevron_right</span>
            <span className={styles.breadcrumbCurrent}>Showtimes</span>
          </nav>
          <h1 className={styles.title}>Showtime Configuration</h1>
        </div>
        <button className={styles.saveBtn} onClick={handleSave}>
          Save Schedule
        </button>
      </div>

      <div className={styles.grid}>
        {/* Left Column: Context & Config */}
        <div className={styles.leftCol}>
          
          {/* Movie Summary Card */}
          <div className={styles.glassCard}>
            <div className={styles.movieSummary}>
              <div className={styles.posterWrapper}>
                <img
                  src={movie.poster || "https://placehold.co/400x600/1E1B1B/FFFFFF?text=No+Poster"}
                  alt={movie.title}
                  className={styles.posterImg}
                />
              </div>
              <div className={styles.movieInfo}>
                <h2 className={styles.movieTitle}>{movie.title}</h2>
                <div className={styles.movieMeta}>
                  <span className={styles.ratingBadge}>PG-13</span>
                  <span>{movie.runtime} Mins</span>
                </div>
                <p className={styles.movieDesc}>{movie.description}</p>
              </div>
            </div>
          </div>

          {/* Configuration Controls */}
          <div className={styles.glassCard}>
            <div className={styles.configGroup}>
              <div className={styles.configGroup}>
                <label className={styles.configLabel}>Date Range</label>
                <div className={styles.dateRange}>
                  <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Start Date</span>
                    <input className={styles.inputField} type="date" defaultValue="2024-05-20" />
                  </div>
                  <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>End Date</span>
                    <input className={styles.inputField} type="date" defaultValue="2024-06-20" />
                  </div>
                </div>
              </div>

              <div className={styles.configGroup}>
                <label className={styles.configLabel}>Theater Location</label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectField}>
                    <option>Grand Cineplex - Hall 4</option>
                    <option>Galaxy Cinemas - Screen 1</option>
                    <option>Metro Theater - Auditorium A</option>
                  </select>
                  <span className={`material-symbols-outlined ${styles.selectIcon}`}>expand_more</span>
                </div>
              </div>

              <button className={styles.addTheaterBtn}>
                <span className="material-symbols-outlined">add</span>
                Add Theater
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Slot Manager */}
        <div className={styles.rightCol}>
          <div className={styles.glassCard}>
            <div className={styles.slotHeader}>
              <h3 className={styles.slotTitle}>Time Slots</h3>
              <button className={styles.addSlotBtn}>
                <span className="material-symbols-outlined">add_circle</span>
                Add Showtime
              </button>
            </div>

            <div className={styles.slotList}>
              {slots.map((slot) => (
                <div key={slot.id} className={styles.slotItem}>
                  
                  <div className={styles.slotTime}>
                    <label className={styles.inputLabel}>Time</label>
                    <input className={styles.inputField} type="time" defaultValue={slot.time} style={{ fontSize: "1.25rem", fontWeight: "bold" }} />
                  </div>

                  <div className={styles.slotFormat}>
                    <label className={styles.inputLabel}>Format</label>
                    <div className={styles.formatTags}>
                      {slot.isImax && <span className={styles.formatTag}>IMAX</span>}
                      {slot.is3d && <span className={styles.formatTagNormal}>3D</span>}
                      {!slot.isImax && !slot.is3d && <span className={styles.formatTagNormal}>2D</span>}
                    </div>
                  </div>

                  <div className={styles.slotActions}>
                    <div>
                      <label className={styles.inputLabel}>Recurring</label>
                      <div className={styles.recurringToggle}>
                        <div 
                          className={`${styles.checkboxWrap} ${slot.isRecurring ? styles.checkboxWrapChecked : ""}`}
                          onClick={() => toggleRecurring(slot.id)}
                        >
                          <input type="checkbox" className={styles.checkboxInput} checked={slot.isRecurring} readOnly />
                          <div className={styles.checkboxKnob} />
                        </div>
                        <span style={{ fontSize: "0.875rem" }}>Daily</span>
                      </div>
                    </div>

                    <div>
                      <label className={styles.inputLabel}>Price</label>
                      <div className={styles.priceInputWrap}>
                        <span className={styles.priceSymbol}>$</span>
                        <input className={styles.priceInput} type="number" defaultValue={slot.price.toFixed(2)} />
                      </div>
                    </div>

                    <div className={styles.actionBtns}>
                      <button className={styles.iconBtn}>
                        <span className="material-symbols-outlined">content_copy</span>
                      </button>
                      <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMovieShowtimesPage;
