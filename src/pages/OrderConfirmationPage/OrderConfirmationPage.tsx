import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OrderConfirmationPage.module.css";
import { Navbar } from "../../components";
import { MovieDto } from "../../types/movie";
import { ShowTimeBriefDto } from "../../types/showtime";
import { TicketDto } from "../../types/booking";
import { PurchaseDto } from "../../types/booking";
import { CommonUtils } from "../../utils/CommonUtils";
import { FilmInfoCard } from "../../components";

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

        {/* Film Info Card */}
        <FilmInfoCard
          movieTitle={movie?.title}
          moviePoster={movie?.poster}
          date={showtime?.date}
          startTime={showtime?.startTime}
          cinemaName={cinemaName}
          cinemaAddress={cinemaAddress}
          auditoriumName={auditoriumName}
          bookingCode={bookingData?.code}
          tickets={tickets}
          totalPrice={bookingData?.grandTotal ?? total}
          maskedCard={maskedCard}
        />

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
