import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyTicketsPage.module.css";
import { bookingService } from "../../services/booking.service";
import { getApiErrorMessage } from "../../api/types";
import { PurchaseDetailDto } from "../../types/booking";
import { TicketCard } from "./components/TicketCard/TicketCard";

const MyTicketsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [upcomingTickets, setUpcomingTickets] = useState<PurchaseDetailDto[]>(
    [],
  );
  const [pastTickets, setPastTickets] = useState<PurchaseDetailDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (activeTab === "upcoming") {
          const tickets = await bookingService.getUpcomings();
          setUpcomingTickets(tickets);
        } else {
          const tickets = await bookingService.getPast();
          setPastTickets(tickets);
        }
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [activeTab]);

  return (
    <div className={styles.page}>
      {/* Header & Search */}
      <div className={styles.header}>
        <h2 className={styles.title}>Vé của tôi</h2>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "upcoming" ? styles.tabActive : styles.tabInactive}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Sắp chiếu
        </button>
        <button
          className={`${styles.tab} ${activeTab === "past" ? styles.tabActive : styles.tabInactive}`}
          onClick={() => setActiveTab("past")}
        >
          Đã qua
        </button>
      </div>

      {/* Ticket Grid */}
      {activeTab === "upcoming" ? (
        <div className={styles.ticketGrid}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "2rem 0", color: "var(--color-error)" }}>
              {error}
            </div>
          ) : upcomingTickets.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
                local_activity
              </span>
              <p className={styles.emptyText}>Bạn chưa có vé nào sắp tới.</p>
              <button
                className={styles.emptyButton}
                onClick={() => navigate("/")}
              >
                Đặt vé ngay
              </button>
            </div>
          ) : (
            upcomingTickets.map((ticket) => (
              <TicketCard key={ticket.code} ticket={ticket} />
            ))
          )}
        </div>
      ) : (
        <div className={styles.ticketGrid}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "2rem 0", color: "var(--color-error)" }}>
              {error}
            </div>
          ) : pastTickets.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
                local_activity
              </span>
              <p className={styles.emptyText}>Không tìm thấy vé nào cả.</p>
              <button
                className={styles.emptyButton}
                onClick={() => navigate("/")}
              >
                Đặt vé ngay
              </button>
            </div>
          ) : (
            pastTickets.map((ticket) => (
              <TicketCard key={ticket.code} ticket={ticket} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
