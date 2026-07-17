import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminMoviesPage.module.css";
import { MovieCard, MovieData } from "./components";

const MOVIES_DATA: MovieData[] = [
  {
    id: 1,
    title: "Neon Horizon",
    genre: "Sci-Fi",
    duration: "2h 24m",
    year: "2024",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlUg_5W-X5ay04jhb5f_sREHGgSLkZtFcvYY1NW5BbnKo-w2TLrErZNLdRMRxkm6d_Njl0mrpGzfqhcYxpOBtrltYt-c3U3zfg6PktJd0YgoftvUHKAYDFVNiKhZdoFox0p4vSbEdD1EzazrKlO6SjeehQgjpcYIGwxOZ9Z51UvJJpY0BbhtBzDBu25XqHZlVuokU1BTUBY7lGtLTCAN-F7c4uK8aL3YcSovFmvO1I6-6FHwHFIeZT",
    status: "NOW SHOWING",
    ticketSales: "$42,300",
    salesGrowth: "+15%",
    imdbRating: "8.7",
  },
  {
    id: 2,
    title: "Shadow Waltz",
    genre: "Thriller",
    duration: "1h 55m",
    year: "Oct 2024",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIgUMn4CybnZPR2eTS_TFnkVzF7zFEzruxrQwDGN7cJHU7Zi-HKc_-Oq751zDDDb8CmCcphPyjFAI8_ECWkNlUUSH_fUug692dhvftZmoVDkpelJAsiEHedrqUfCWj6eX0xJb_lFRHxMdFMhKWHFJZORVBw8c2BSgVdpT1s5NQIhFjCrNzj3lQl83GHHzuuSn8J2D1FnGvm0awN7w9GRTsvPY6TGrqk9Cq3tUi4wouI47Xd3xwZXb0",
    status: "COMING SOON",
    ticketSales: "$0",
    salesGrowth: "0%",
    imdbRating: "N/A",
  },
];

const FILTER_TABS = ["All Movies", "Now Showing", "Coming Soon", "Archived"];

const AdminMoviesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All Movies");
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Movie Catalog</h2>
          <p className={styles.subtitle}>
            Manage global movie metadata, showtimes, and distribution analytics.
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.filterBtn}>
            <span className="material-symbols-outlined">filter_list</span>
            Advanced Filters
          </button>
          <button className={styles.addBtn} onClick={() => navigate('/admin/movies/new')}>
            <span className="material-symbols-outlined">add</span>
            New Movie
          </button>
        </div>
      </div>

      {/* Quick Stats Placeholder */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Active Movies</span>
            <span className="material-symbols-outlined">theaters</span>
          </div>
          <p className={styles.statValue}>24</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Ticket Sales</span>
            <span className="material-symbols-outlined">payments</span>
          </div>
          <p className={styles.statValue}>$142.8k</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Avg Rating</span>
            <span className="material-symbols-outlined">star</span>
          </div>
          <p className={styles.statValue}>4.8</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Upcoming</span>
            <span className="material-symbols-outlined">upcoming</span>
          </div>
          <p className={styles.statValue}>12</p>
        </div>
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
          <select className={styles.filterSelect}>
            <option>All Genres</option>
            <option>Action</option>
            <option>Drama</option>
            <option>Sci-Fi</option>
          </select>
          <select className={styles.filterSelect}>
            <option>All Locations</option>
            <option>Downtown IMAX</option>
            <option>Grand Plaza</option>
            <option>Sunset Cinema</option>
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      <div className={styles.moviesGrid}>
        {MOVIES_DATA.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default AdminMoviesPage;
