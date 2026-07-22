import React from "react";
import { PurchaseDetailDto } from "../../api/types";
import { TicketDto } from "../../api/ticket.service";
import { CommonUtils } from "../../utils/CommonUtils";
import styles from "./FilmInfoCard.module.css";

interface FilmInfoCardProps {
  /** Full purchase detail (used in TicketDetailPage) */
  purchase?: PurchaseDetailDto;
  /** Or pass individual fields (used in OrderConfirmationPage) */
  movieTitle?: string;
  moviePoster?: string;
  date?: string;
  startTime?: string;
  cinemaName?: string;
  cinemaAddress?: string;
  auditoriumName?: string;
  bookingCode?: string;
  tickets?: TicketDto[];
  /** Optional payment summary (OrderConfirmationPage only) */
  totalPrice?: number;
  maskedCard?: string;
}

const FilmInfoCard: React.FC<FilmInfoCardProps> = (props) => {
  // Normalise props — prefer the `purchase` shorthand
  const movieTitle = props.purchase?.showtime.movie.title ?? props.movieTitle;
  const moviePoster =
    props.purchase?.showtime.movie.poster ?? props.moviePoster;
  const date = props.purchase?.showtime.date ?? props.date;
  const startTime = props.purchase?.showtime.startTime ?? props.startTime;
  const cinemaName =
    props.purchase?.showtime.auditorium.cinema.name ?? props.cinemaName;
  const cinemaAddress =
    props.purchase?.showtime.auditorium.cinema.address ?? props.cinemaAddress;
  const auditoriumName =
    props.purchase?.showtime.auditorium.name ?? props.auditoriumName;
  const bookingCode = props.purchase?.code ?? props.bookingCode;
  const tickets = props.purchase?.tickets ?? props.tickets ?? [];
  const { totalPrice, maskedCard } = props;

  return (
    <div className={styles.filmInfoCard}>
      {/* Header — Movie Title */}
      <div className={styles.cardHeader}>
        <h2 className={styles.movieTitle}>{movieTitle}</h2>
      </div>

      {/* Body — Poster + Details Grid */}
      <div className={styles.cardBody}>
        {/* Poster */}
        <div className={styles.posterColumn}>
          <div className={styles.posterWrapper}>
            <img
              src={moviePoster}
              alt={movieTitle}
              className={styles.posterImage}
            />
          </div>
        </div>

        {/* Details */}
        <div className={styles.detailsColumn}>
          <div className={styles.infoGrid}>
            <div>
              <p className={styles.label}>Ngày chiếu</p>
              <p className={styles.infoValue}>
                {CommonUtils.formatDateVN(date)}
              </p>
            </div>
            <div>
              <p className={styles.label}>Giờ chiếu</p>
              <p className={styles.infoValue}>
                {startTime ? startTime.substring(0, 5) : "--:--"}
              </p>
            </div>

            <div className={styles.colSpan2}>
              <p className={styles.label}>Rạp</p>
              <p className={styles.infoValue}>{cinemaName}</p>
              {cinemaAddress && (
                <p className={styles.theaterSub}>{cinemaAddress}</p>
              )}
              {auditoriumName && (
                <p className={styles.theaterSub}>{auditoriumName}</p>
              )}
            </div>

            {tickets.length > 0 && (
              <div className={styles.colSpan2}>
                <p className={styles.label}>Ghế</p>
                <div className={styles.seatsWrapper}>
                  {tickets.map((t) => (
                    <span key={t.id} className={styles.seatBadge}>
                      {t.rowLetter}
                      {t.seatNumber}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(bookingCode || totalPrice !== undefined) && (
              <div className={styles.bookingPriceRow}>
                {bookingCode && (
                  <div>
                    <p className={styles.label}>Mã Đặt Vé</p>
                    <p className={styles.bookingIdValue}>{bookingCode}</p>
                  </div>
                )}
                {totalPrice !== undefined && (
                  <div className={styles.priceBlock}>
                    <p className={styles.label}>Tổng thanh toán</p>
                    <p className={styles.totalAmount}>
                      {CommonUtils.formatNumberVietnamese(totalPrice)} đ
                    </p>
                    {maskedCard && (
                      <div className={styles.cardInfo}>
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "1rem" }}
                        >
                          credit_card
                        </span>
                        <span>**** {maskedCard}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmInfoCard;
