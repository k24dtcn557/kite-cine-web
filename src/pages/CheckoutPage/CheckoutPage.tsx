import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./CheckoutPage.module.css";
import { Navbar } from "../../components";
import { MovieDto } from "../../api/movie.service";
import { ShowTimeBriefDto } from "../../api/show-time.service";
import { SeatDto } from "../../api/cinema.service";
import { TicketDto } from "../../api/ticket.service";
import { toast } from "react-hot-toast";
import { CommonUtils } from "../../utils/CommonUtils";
import { PRICE_MODEL_SEAT_TYPES } from "../../api/price-model.service";

const getSeatTypeLabel = (type: string) => {
  return PRICE_MODEL_SEAT_TYPES.find((t) => t.type === type)?.label || type;
};

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const movie = location.state?.movie as MovieDto | undefined;
  const cinemaName = location.state?.cinemaName as string | undefined;
  const showtime = location.state?.showtime as ShowTimeBriefDto | undefined;
  const selectedTickets = (location.state?.selectedTickets as TicketDto[]) || [];

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (selectedTickets.length === 0) {
      toast.error("Không có vé nào được chọn. Đang quay lại.");
      navigate("/");
    }
  }, [selectedTickets, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("Hết thời gian giữ ghế. Đang quay lại.");
      navigate(-1);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatDateVN = (dateStr?: string) => {
    if (!dateStr) return "Ngày chiếu";
    try {
      const d = new Date(
        dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`,
      );
      const days = [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
      ];
      const dd = d.getDate().toString().padStart(2, "0");
      const mm = (d.getMonth() + 1).toString().padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${days[d.getDay()]}, ${dd}/${mm}/${yyyy}`;
    } catch {
      return dateStr;
    }
  };

  const calculateSubtotal = () => {
    return selectedTickets.reduce((acc, ticket) => acc + ticket.purchasePrice, 0);
  };

  const subtotal = calculateSubtotal();
  const taxes = 0; // Hardcoded for demo
  const total = subtotal + taxes;

  const handlePurchase = () => {
    toast.success("Thanh toán thành công! Vé đã được gửi vào email.");
    navigate("/my-cine");
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Secure Checkout</h1>
            <div className={styles.timerPill}>
              <span className={`material-symbols-outlined ${styles.timerIcon}`}>
                schedule
              </span>
              <span className={styles.timerText}>
                Seats reserved for{" "}
                <span className={styles.timerTime}>{formatTime(timeLeft)}</span>
              </span>
            </div>
          </div>

          <section className={styles.glassPanel}>
            <h2 className={styles.panelTitle}>Express Checkout</h2>
            <div className={styles.expressButtons}>
              <button className={styles.btnApplePay}>
                <span className="material-symbols-outlined">
                  account_balance_wallet
                </span>{" "}
                Apple Pay
              </button>
              <button className={styles.btnGooglePay}>
                <span className="material-symbols-outlined">payments</span>{" "}
                Google Pay
              </button>
            </div>
          </section>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>Or pay with card</span>
            <div className={styles.dividerLine}></div>
          </div>

          <section className={styles.glassPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle} style={{ marginBottom: 0 }}>
                Payment Method
              </h2>
              <div className={styles.panelIcons}>
                <span className="material-symbols-outlined">credit_card</span>
                <span className="material-symbols-outlined">lock</span>
              </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Card Number</label>
                <div className={styles.inputWrapper}>
                  <input
                    className={styles.inputField}
                    placeholder="0000 0000 0000 0000"
                    type="text"
                  />
                  <span
                    className={`material-symbols-outlined ${styles.inputIcon}`}
                  >
                    credit_score
                  </span>
                </div>
              </div>
              <div className={styles.formRow}>
                <div>
                  <label className={styles.label}>Expiry Date</label>
                  <input
                    className={styles.inputField}
                    placeholder="MM/YY"
                    type="text"
                  />
                </div>
                <div>
                  <label className={styles.label}>CVV</label>
                  <input
                    className={styles.inputField}
                    placeholder="123"
                    type="text"
                  />
                </div>
              </div>
              <div>
                <label className={styles.label}>Cardholder Name</label>
                <input
                  className={styles.inputField}
                  placeholder="Name on card"
                  type="text"
                />
              </div>
            </form>
          </section>

          <section className={styles.glassPanel}>
            <h2 className={styles.panelTitle}>Gift Card or Promo Code</h2>
            <div className={styles.promoContainer}>
              <input
                className={styles.inputField}
                placeholder="Enter code"
                type="text"
              />
              <button className={styles.btnApply}>Apply</button>
            </div>
          </section>
        </div>

        <div className={styles.rightColumn}>
          <div className={`${styles.glassPanel} ${styles.stickyPanel}`}>
            <div
              className={styles.movieBanner}
              style={{
                backgroundImage: `url('${movie?.poster || "https://placehold.co/800x400/1E1B1B/FFFFFF?text=Poster"}')`,
              }}
            >
              <div className={styles.movieBannerOverlay}></div>
              <div className={styles.movieBannerContent}>
                <span className={styles.movieTag}>
                  {movie?.genres || "MOVIE"}
                </span>
                <h3 className={styles.movieBannerTitle}>
                  {movie?.title || "Phim đang chọn"}
                </h3>
              </div>
            </div>

            <div className={styles.summaryBody}>
              <div className={styles.sessionInfo}>
                <div>
                  <span className={styles.infoLabel}>Date &amp; Time</span>
                  <span className={styles.infoValue}>
                    {formatDateVN(showtime?.date)} •{" "}
                    {showtime?.startTime
                      ? showtime.startTime.substring(0, 5)
                      : "Giờ chiếu"}
                  </span>
                </div>
                <div>
                  <span className={styles.infoLabel}>Location</span>
                  <span className={styles.infoValue}>
                    {cinemaName || "Cineplex"}
                  </span>
                </div>
              </div>

              <div className={styles.ticketsSection}>
                <h4 className={styles.sectionLabel}>Tickets</h4>
                <div className={styles.ticketList}>
                  {selectedTickets.map((ticket) => (
                    <div key={ticket.id} className={styles.perforatedTicket}>
                      <div className={styles.ticketLeft}>
                        <span
                          className={`material-symbols-outlined ${styles.ticketIcon}`}
                        >
                          chair
                        </span>
                        <div>
                          <div className={styles.ticketSeatNumber}>
                            Seat {ticket.rowLetter}
                            {ticket.seatNumber}
                          </div>
                          <div className={styles.ticketType}>
                            {getSeatTypeLabel(ticket.seatType)}
                          </div>
                        </div>
                      </div>
                      <div className={styles.ticketPrice}>
                        {CommonUtils.formatNumberVietnamese(ticket.purchasePrice)} đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.totalsSection}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>{CommonUtils.formatNumberVietnamese(subtotal)} đ</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Taxes &amp; Fees</span>
                  <span>{CommonUtils.formatNumberVietnamese(taxes)} đ</span>
                </div>
                <div className={styles.finalTotalRow}>
                  <span>Total</span>
                  <span>{CommonUtils.formatNumberVietnamese(total)} đ</span>
                </div>
              </div>

              <button className={styles.btnPurchase} onClick={handlePurchase}>
                <span className="material-symbols-outlined">lock</span> Complete
                Purchase
              </button>
              <p className={styles.securityText}>
                <span
                  className={`material-symbols-outlined ${styles.securityIcon}`}
                >
                  shield
                </span>{" "}
                Secure 256-bit SSL Encryption
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
