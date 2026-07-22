import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TicketCard.module.css";
import { PurchaseDetailDto } from "../../../../api/types";
import { CommonUtils } from "../../../../utils/CommonUtils";

interface TicketCardProps {
  ticket: PurchaseDetailDto;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <div className={`${styles.ticketCard} ${styles.ticketMask}`}>
      {/* Poster */}
      <div className={styles.posterWrapper}>
        <img
          alt={ticket.showtime.movie.title}
          className={styles.posterImage}
          src={ticket.showtime.movie.poster}
        />
        <div className={styles.posterOverlay}></div>
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
