import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TicketCard.module.css";
import { PurchaseDetailDto, BookingStatus, BookingStatusText } from "../../../../types/booking";
import { CommonUtils } from "../../../../utils/CommonUtils";

interface TicketCardProps {
  ticket: PurchaseDetailDto;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate();
  const isCancelled = ticket.status === BookingStatus.CANCELLED;

  return (
    <div className={`${styles.ticketCard} ${styles.ticketMask} ${isCancelled ? styles.ticketCancelled : ""}`}>
      {/* Poster */}
      <div className={styles.posterWrapper}>
        <img
          alt={ticket.showtime.movie.title}
          className={styles.posterImage}
          src={ticket.showtime.movie.poster}
        />
        <div className={styles.posterOverlay}></div>
        {isCancelled && (
          <div className={styles.cancelledChip}>
            {BookingStatusText[BookingStatus.CANCELLED]}
          </div>
        )}
      </div>

      {/* Details */}
      <div className={styles.details}>
        <div>
          <div className={styles.ticketHeader}>
            <h3 className={styles.movieTitle}>{ticket.showtime.movie.title}</h3>
          </div>
          <div className={styles.infoGrid}>
            <div>
              <span className={styles.infoLabel}>Ngày</span>
              <span className={styles.infoValue}>
                {CommonUtils.formatDateVN(ticket.showtime.date)}
              </span>
            </div>
            <div>
              <span className={styles.infoLabel}>Giờ</span>
              <span className={styles.infoValue}>
                {CommonUtils.formatTimeVN(ticket.showtime.startTime)}
              </span>
            </div>
            <div>
              <span className={styles.infoLabel}>Rạp</span>
              <span className={styles.infoValue}>
                {ticket.showtime.auditorium.cinema.name}
              </span>
            </div>
            <div>
              <span className={styles.infoLabel}>Ghế</span>
              {ticket.tickets
                .map((t) => `${t.rowLetter}${t.seatNumber}`)
                .sort()
                .join(", ")}
            </div>
          </div>
        </div>
        <div className={styles.ticketFooter}>
          <button
            className={styles.btnViewTicket}
            onClick={() => navigate(`/my-cine/tickets/${ticket.code}`)}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1rem" }}
            >
              qr_code
            </span>
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};
