import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OrderConfirmationPage.module.css";
import { Navbar } from "../../components";
import { MovieDto } from "../../api/movie.service";
import { ShowTimeBriefDto } from "../../api/show-time.service";
import { TicketDto } from "../../api/ticket.service";
import { PurchaseDto } from "../../api/booking.service";
import { CommonUtils } from "../../utils/CommonUtils";
import { PRICE_MODEL_SEAT_TYPES } from "../../api/price-model.service";
import { QRCodeSVG } from "qrcode.react";

const getSeatTypeLabel = (type: string) =>
  PRICE_MODEL_SEAT_TYPES.find((t) => t.type === type)?.label || type;

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const movie = location.state?.movie as MovieDto | undefined;
  const cinemaName = location.state?.cinemaName as string | undefined;
  const cinemaAddress = location.state?.cinemaAddress as string | undefined;
  const auditoriumName = location.state?.auditoriumName as string | undefined;
  const showtime = location.state?.showtime as ShowTimeBriefDto | undefined;
  const selectedTickets =
    (location.state?.selectedTickets as TicketDto[]) || [];
  const bookingData = location.state?.bookingData as PurchaseDto | undefined;
  const maskedCard = location.state?.maskedCard as string | undefined;

  const total = selectedTickets.reduce((acc, t) => acc + t.purchasePrice, 0);

  // Prefer tickets from the completed payment response (they have QR codes)
  const tickets = bookingData?.tickets ?? selectedTickets;

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.mainContent}>
        {/* Cinematic background glow */}
        <div className={styles.bgGlow}></div>

        {/* Success Header */}
        <div className={styles.successHeader}>
          <div className={styles.checkCircle}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "2.5rem", fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <h1 className={styles.successTitle}>Đặt vé thành công!</h1>
        </div>

        {/* Main bento grid */}
        <div className={styles.bentoGrid}>
          {/* Movie Poster */}
          <div className={styles.posterCard}>
            <img
              src={movie?.poster}
              alt={movie?.title}
              className={styles.posterImage}
            />
            <div className={styles.posterOverlay}>
              <h2 className={styles.posterTitle}>{movie?.title}</h2>
            </div>
          </div>

          {/* Right column */}
          <div className={styles.detailsColumn}>
            {/* Showtime Details */}
            <div className={styles.glassCard}>
              <h3 className={styles.cardTitle}>Chi tiết suất chiếu</h3>
              <div className={styles.showtimeGrid}>
                <div>
                  <p className={styles.infoLabel}>Ngày chiếu</p>
                  <p className={styles.infoValue}>
                    {CommonUtils.formatDateVN(showtime?.date)}
                  </p>
                </div>
                <div>
                  <p className={styles.infoLabel}>Giờ chiếu</p>
                  <p className={styles.infoValue}>
                    {showtime?.startTime
                      ? showtime.startTime.substring(0, 5)
                      : "--:--"}
                  </p>
                </div>
                <div className={styles.colSpan2}>
                  <p className={styles.infoLabel}>Rạp chiếu</p>
                  <p className={styles.infoValue}>{cinemaName}</p>
                  <p className={styles.infoSubValue}>
                    {cinemaAddress && ` • ${cinemaAddress}`}
                  </p>
                  <p className={styles.infoSubValue}>
                    {auditoriumName && `${auditoriumName}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Info */}
            <div className={styles.transactionCard}>
              <div>
                <p className={styles.infoLabel}>Mã đặt vé</p>
                <p className={styles.bookingCode}>
                  {bookingData?.code || "---"}
                </p>
              </div>
              <div className={styles.transactionRight}>
                <p className={styles.infoLabel}>Tổng thanh toán</p>
                <p className={styles.totalAmount}>
                  {CommonUtils.formatNumberVietnamese(
                    bookingData?.grandTotal ?? total,
                  )}{" "}
                  đ
                </p>
                {maskedCard && (
                  <p className={styles.cardInfo}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      credit_card
                    </span>{" "}
                    **** {maskedCard}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Section */}
        <div className={styles.ticketsSection}>
          <div className={styles.ticketsSectionHeader}>
            <h3 className={styles.ticketsSectionTitle}>Vé của bạn</h3>
            <p className={styles.ticketsSectionSubtitle}>Quét tại cửa vào</p>
          </div>
          <div className={styles.ticketsList}>
            {tickets.map((ticket) => (
              <div key={ticket.id} className={styles.ticketCard}>
                <div className={styles.ticketTop}>
                  <div className={styles.ticketSeatNumber}>
                    {ticket.rowLetter}
                    {ticket.seatNumber}
                  </div>
                  <p className={styles.ticketSeatType}>
                    {getSeatTypeLabel(ticket.seatType)}
                  </p>
                </div>
                <div className={styles.ticketDivider}></div>
                <div className={styles.ticketBottom}>
                  {ticket.qrCode ? (
                    <div className={styles.qrWrapper}>
                      <QRCodeSVG
                        value={ticket.qrCode}
                        size={108}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                      />
                    </div>
                  ) : (
                    <div className={styles.qrCode}>
                      <div className={styles.qrInner}></div>
                    </div>
                  )}
                  <p className={styles.ticketCode}>{ticket.qrCode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className={styles.actionFooter}>
          <button
            className={styles.btnSecondary}
            onClick={() => navigate("/my-cine/tickets")}
          >
            <span className="material-symbols-outlined">
              confirmation_number
            </span>
            Xem vé của tôi
          </button>
          <button className={styles.btnPrimary} onClick={() => navigate("/")}>
            <span className="material-symbols-outlined">home</span>
            Về trang chủ
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;
