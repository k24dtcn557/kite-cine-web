import React, { useState } from "react";
import styles from "./MovieShowtimes.module.css";

const MOCK_DATES = [
  { day: "Today", date: "24", month: "OCT" },
  { day: "Fri", date: "25", month: "OCT" },
  { day: "Sat", date: "26", month: "OCT" },
  { day: "Sun", date: "27", month: "OCT" },
  { day: "Mon", date: "28", month: "OCT" },
  { day: "Tue", date: "29", month: "OCT" },
];

const MovieShowtimes: React.FC = () => {
  const [activeDate, setActiveDate] = useState("24");

  return (
    <section id="showtimes" className={styles.section}>
      <h2 className={styles.heading}>Lịch Chiếu Phim</h2>

      {/* Date Picker */}
      <div className={styles.datePicker}>
        {MOCK_DATES.map((d) => (
          <button
            key={d.date}
            className={`${styles.dateBtn} ${
              activeDate === d.date ? styles.dateBtnActive : ""
            }`}
            onClick={() => setActiveDate(d.date)}
            aria-pressed={activeDate === d.date}
          >
            <span className={styles.dayLabel}>{d.day}</span>
            <span className={styles.dateLabel}>{d.date}</span>
            <span className={styles.monthLabel}>{d.month}</span>
          </button>
        ))}
      </div>

      {/* Theater Groups */}
      <div>
        <div className={styles.theaterCard}>
          <div className={styles.theaterHeader}>
            <div>
              <h3 className={styles.theaterName}>
                Cineplex Grand Emporium
                <span className={styles.luxuryBadge}>Luxury</span>
              </h3>
              <div className={styles.theaterLocation}>
                <span
                  className={`material-symbols-outlined ${styles.locationIcon}`}
                >
                  location_on
                </span>
                5.2 miles away • Hollywood Blvd
              </div>
            </div>
            <button className={styles.infoBtn} aria-label="Theater Information">
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>

          <div className={styles.showtimeRow}>
            <div className={styles.formatLabel}>IMAX 3D</div>
            <div className={styles.timesGrid}>
              <button className={`${styles.timeBtn} ${styles.timeBtnImax}`}>
                14:20
              </button>
              <button className={`${styles.timeBtn} ${styles.timeBtnImax}`}>
                17:45
              </button>
              <button className={`${styles.timeBtn} ${styles.timeBtnImax}`}>
                21:00
              </button>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.showtimeRow}>
            <div className={styles.formatLabel}>Standard</div>
            <div className={styles.timesGrid}>
              <button className={styles.timeBtn}>10:30</button>
              <button className={styles.timeBtn}>13:15</button>
              <button className={styles.timeBtn}>16:40</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieShowtimes;
