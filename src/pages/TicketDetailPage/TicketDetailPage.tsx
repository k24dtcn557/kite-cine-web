import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TicketDetailPage.module.css";
import { bookingService } from "../../services/booking.service";
import { PurchaseDetailDto } from "../../types/booking";
import { FilmInfoCard } from "../../components";

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<PurchaseDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      try {
        const data = await bookingService.getBooking(id);
        setTicket(data);
      } catch (err) {
        setError("Không thể tải chi tiết vé.");
      }
    };
    fetchTicket();
  }, [id]);

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <p style={{ color: "var(--color-error)", marginTop: "2rem" }}>
          {error}
        </p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Đang tải chi tiết vé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumb / Back Navigation */}
      <div className={styles.breadcrumb}>
        <button
          className={styles.btnBack}
          onClick={() => navigate("/my-cine/tickets")}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "1.125rem" }}
          >
            arrow_back
          </span>
          <span>Quay lại danh sách vé</span>
        </button>
      </div>

      {/* Film Info Card */}
      <FilmInfoCard purchase={ticket} totalPrice={ticket.grandTotal} />
    </div>
  );
};

export default TicketDetailPage;
