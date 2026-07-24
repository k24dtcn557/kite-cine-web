import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./CheckoutPage.module.css";
import { Navbar } from "../../components";
import { MovieDto } from "../../types/movie";
import { ShowTimeBriefDto } from "../../types/showtime";
import { ticketService } from "../../services/ticket.service";
import { TicketDto } from "../../types/booking";
import { bookingService } from "../../services/booking.service";
import { PurchaseDto } from "../../types/booking";
import { toast } from "react-hot-toast";
import { CommonUtils } from "../../utils/CommonUtils";
import { PRICE_MODEL_SEAT_TYPES } from "../../types/showtime";

const getSeatTypeLabel = (type: string) => {
  return PRICE_MODEL_SEAT_TYPES.find((t) => t.type === type)?.label || type;
};

const CheckoutPage: React.FC = () => {
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

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  useEffect(() => {
    if (selectedTickets.length === 0 || !bookingData) {
      toast.error("Không có thông tin vé hoặc giao dịch. Đang quay lại.");
      navigate("/");
    }
  }, [selectedTickets, bookingData, navigate]);

  useEffect(() => {
    if (!bookingData?.expirationTime) return;

    const expirationDate = new Date(bookingData.expirationTime).getTime();

    const calculateRemaining = () => {
      const now = new Date().getTime();
      return Math.max(0, Math.floor((expirationDate - now) / 1000));
    };

    setTimeLeft(calculateRemaining());

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        toast.error("Hết thời gian giữ ghế. Đang quay lại.");
        navigate(-1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingData, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const calculateSubtotal = () => {
    return selectedTickets.reduce(
      (acc, ticket) => acc + ticket.purchasePrice,
      0,
    );
  };

  const subtotal = calculateSubtotal();
  const taxes = 0; // Hardcoded for demo
  const total = subtotal + taxes;

  const handlePurchase = async () => {
    if (!bookingData?.code) {
      toast.error("Không tìm thấy mã giao dịch.");
      return;
    }

    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      toast.error("Vui lòng nhập đầy đủ thông tin thẻ.");
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(cleanCardNumber)) {
      toast.error("Số thẻ không hợp lệ. Vui lòng nhập đúng 16 chữ số.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      toast.error("Ngày hết hạn phải có định dạng MM/YY.");
      return;
    }

    const [monthStr, yearStr] = expiryDate.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (month < 1 || month > 12) {
      toast.error("Tháng hết hạn không hợp lệ.");
      return;
    }

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      toast.error("Thẻ đã hết hạn.");
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      toast.error("CVV phải có đúng 3 chữ số.");
      return;
    }

    if (cardholderName.trim().length < 2) {
      toast.error("Tên chủ thẻ không hợp lệ.");
      return;
    }

    try {
      setIsPaying(true);
      await bookingService.payBooking(bookingData.code);
      toast.success("Thanh toán thành công!");
      navigate("/order-confirmation", {
        state: {
          movie,
          cinemaName,
          cinemaAddress,
          auditoriumName,
          showtime,
          selectedTickets,
          bookingData,
          maskedCard: cardNumber.replace(/\s/g, "").slice(-4),
        },
      });
    } catch (error) {
      toast.error("Thanh toán thất bại. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Thanh toán</h1>
            <div className={styles.timerPill}>
              <span className={`material-symbols-outlined ${styles.timerIcon}`}>
                schedule
              </span>
              <span className={styles.timerText}>
                Thời gian giữ ghế còn lại{" "}
                <span className={styles.timerTime}>
                  {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
                </span>
              </span>
            </div>
          </div>

          <section className={styles.glassPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle} style={{ marginBottom: 0 }}>
                Phương thức thanh toán
              </h2>
              <div className={styles.panelIcons}>
                <span className="material-symbols-outlined">credit_card</span>
                <span className="material-symbols-outlined">lock</span>
              </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Số thẻ</label>
                <div className={styles.inputWrapper}>
                  <input
                    className={styles.inputField}
                    placeholder="0000 0000 0000 0000"
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .substring(0, 16);
                      const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                      setCardNumber(formatted);
                    }}
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
                  <label className={styles.label}>Ngày hết hạn</label>
                  <input
                    className={styles.inputField}
                    placeholder="MM/YY"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={expiryDate}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .substring(0, 4);
                      if (digits.length >= 3) {
                        setExpiryDate(
                          `${digits.substring(0, 2)}/${digits.substring(2)}`,
                        );
                      } else if (
                        e.target.value.endsWith("/") &&
                        digits.length === 2
                      ) {
                        setExpiryDate(`${digits}/`);
                      } else {
                        setExpiryDate(digits);
                      }
                    }}
                  />
                </div>
                <div>
                  <label className={styles.label}>CVV</label>
                  <input
                    className={styles.inputField}
                    placeholder="123"
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .substring(0, 3);
                      setCvv(digits);
                    }}
                  />
                </div>
              </div>
              <div>
                <label className={styles.label}>Tên chủ thẻ</label>
                <input
                  className={styles.inputField}
                  placeholder="Tên in trên thẻ"
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                />
              </div>
            </form>
          </section>
        </div>

        <div className={styles.rightColumn}>
          <div className={`${styles.glassPanel} ${styles.stickyPanel}`}>
            <div className={styles.movieInfoBox}>
              <div
                className={styles.moviePoster}
                style={{
                  backgroundImage: `url('${movie?.poster || "https://placehold.co/400x600/1E1B1B/FFFFFF?text=Poster"}')`,
                }}
              ></div>
              <div className={styles.movieDetails}>
                <h2 className={styles.movieTitle}>
                  {movie?.title || "Đang tải phim..."}
                </h2>
                <div
                  className={styles.movieDetailText}
                  style={{ alignItems: "flex-start" }}
                >
                  <span
                    className={`material-symbols-outlined ${styles.movieDetailIcon}`}
                    style={{ marginTop: "2px" }}
                  >
                    location_on
                  </span>
                  <div>
                    <div>{cinemaName || "Cineplex"}</div>
                    {cinemaAddress && (
                      <div
                        style={{
                          fontSize: "0.85em",
                          opacity: 0.8,
                          marginTop: "2px",
                        }}
                      >
                        {cinemaAddress}
                      </div>
                    )}
                  </div>
                </div>
                {auditoriumName && (
                  <p className={styles.movieDetailText}>
                    <span
                      className={`material-symbols-outlined ${styles.movieDetailIcon}`}
                    >
                      meeting_room
                    </span>
                    Phòng {auditoriumName}
                  </p>
                )}
                <p className={styles.movieDetailText}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "1.1rem" }}
                  >
                    calendar_today
                  </span>
                  {CommonUtils.formatDateVN(showtime?.date)}
                </p>
                <p className={styles.movieDetailText}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "1.1rem" }}
                  >
                    schedule
                  </span>
                  Suất{" "}
                  {showtime?.startTime
                    ? showtime.startTime.substring(0, 5)
                    : ""}
                </p>
              </div>
            </div>

            <div className={styles.summaryBody}>
              <div className={styles.ticketsSection}>
                <h4 className={styles.sectionLabel}>Vé đang chọn</h4>
                <div className={styles.ticketList}>
                  {selectedTickets.map((ticket) => (
                    <div key={ticket.id} className={styles.perforatedTicket}>
                      <div className={styles.ticketLeft}>
                        <div>
                          <div className={styles.ticketSeatNumber}>
                            Ghế {ticket.rowLetter}
                            {ticket.seatNumber}
                          </div>
                          <div className={styles.ticketType}>
                            {getSeatTypeLabel(ticket.seatType)}
                          </div>
                        </div>
                      </div>
                      <div className={styles.ticketPrice}>
                        {CommonUtils.formatNumberVietnamese(
                          ticket.purchasePrice,
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.totalsSection}>
                <div className={styles.finalTotalRow}>
                  <span>Tổng cộng</span>
                  <span>{CommonUtils.formatNumberVietnamese(total)} đ</span>
                </div>
              </div>

              <button
                className={styles.btnPurchase}
                onClick={handlePurchase}
                disabled={isPaying || timeLeft === null || timeLeft <= 0}
              >
                {isPaying ? (
                  <span
                    className={`material-symbols-outlined ${styles.spinIcon}`}
                  >
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined">lock</span>
                )}{" "}
                {isPaying ? "Đang xử lý..." : "Hoàn tất thanh toán"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
