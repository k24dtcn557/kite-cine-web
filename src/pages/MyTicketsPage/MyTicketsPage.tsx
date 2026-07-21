import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyTicketsPage.module.css";

const MOCK_TICKETS = [
  {
    id: "1",
    title: "Neon Horizon",
    format: "IMAX",
    date: "Oct 24, 2024",
    time: "8:30 PM",
    theater: "Cinema 1",
    seats: "G12, G13",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQfOkUVWOc2UP5E-ZRJY_Su7-7e21ocBftcfWJxSi4iqDIElG6yjyNRrGksckYXkcZAuHdyKc78AOaLvKR-JIbClLxda6jSIox6y3RUfuhCeqvwTj7pviQ6GnMIoKRrB5Te7jj8qNAxaU_oUVX3c07k4vCRHUue6XZcfevTqSizGUvJIbNHb3sV-Ep9EbbeY7i-yYIUolmvBWYS0ZVadIRHoq-tCQAFgPfheACLOm4MFun7xvRj_Yc",
  },
  {
    id: "2",
    title: "Cyber City",
    format: "2D",
    date: "Oct 28, 2024",
    time: "7:00 PM",
    theater: "Cinema 4",
    seats: "D4, D5",
    posterUrl: "https://placehold.co/400x600/1E1B1B/FFFFFF?text=Cyber+City",
  }
];

const MyTicketsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Header & Search */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>My Tickets</h2>
          <p className={styles.subtitle}>
            Manage your upcoming cinematic journeys.
          </p>
        </div>
        <div className={styles.searchContainer}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>
            search
          </span>
          <input
            className={styles.searchInput}
            placeholder="Search bookings..."
            type="text"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "upcoming" ? styles.tabActive : styles.tabInactive}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`${styles.tab} ${activeTab === "past" ? styles.tabActive : styles.tabInactive}`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      {/* Ticket Grid */}
      {activeTab === "upcoming" ? (
        <div className={styles.ticketGrid}>
          {MOCK_TICKETS.map((ticket) => (
            <div key={ticket.id} className={`${styles.ticketCard} ${styles.ticketMask}`}>
              {/* Abstract Glow */}
              <div className={styles.glow}></div>

              {/* Poster */}
              <div className={styles.posterWrapper}>
                <img
                  alt={ticket.title}
                  className={styles.posterImage}
                  src={ticket.posterUrl}
                />
                <div className={styles.posterOverlay}></div>
              </div>

              {/* Details */}
              <div className={styles.details}>
                <div>
                  <div className={styles.ticketHeader}>
                    <h3 className={styles.movieTitle}>{ticket.title}</h3>
                    <span className={styles.formatBadge}>{ticket.format}</span>
                  </div>
                  <div className={styles.infoGrid}>
                    <div>
                      <span className={styles.infoLabel}>Date</span>
                      <span className={styles.infoValue}>{ticket.date}</span>
                    </div>
                    <div>
                      <span className={styles.infoLabel}>Time</span>
                      <span className={styles.infoValue}>{ticket.time}</span>
                    </div>
                    <div>
                      <span className={styles.infoLabel}>Theater</span>
                      <span className={styles.infoValue}>{ticket.theater}</span>
                    </div>
                    <div>
                      <span className={styles.infoLabel}>Seats</span>
                      <span className={styles.infoValue}>{ticket.seats}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.ticketFooter}>
                  <button 
                    className={styles.btnViewTicket}
                    onClick={() => navigate(`/my-cine/tickets/${ticket.id}`)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                      qr_code
                    </span>
                    View Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "2rem 0", color: "var(--color-on-surface-variant)" }}>
          No past tickets found.
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
