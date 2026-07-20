import React, { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import styles from "./BookingPage.module.css";
import { Navbar } from "../../components";
import { cinemaService, SeatRowDto, SeatDto } from "../../api/cinema.service";
import { MovieDto } from "../../api/movie.service";
import { ShowTimeBriefDto } from "../../api/show-time.service";

const BookingPage: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const [searchParams] = useSearchParams();
  const auditoriumId = searchParams.get("auditoriumId");
  const navigate = useNavigate();
  const location = useLocation();

  const movie = location.state?.movie as MovieDto | undefined;
  const cinemaName = location.state?.cinemaName as string | undefined;
  const showtime = location.state?.showtime as ShowTimeBriefDto | undefined;

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

  const [seatRows, setSeatRows] = useState<SeatRowDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<SeatDto[]>([]);

  useEffect(() => {
    const fetchSeats = async () => {
      if (!auditoriumId) return;
      try {
        setLoading(true);
        const rows = await cinemaService.getAuditoriumSeats(
          parseInt(auditoriumId, 10),
        );
        setSeatRows(rows || []);
      } catch (error) {
        console.error("Failed to fetch seats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [auditoriumId]);

  const toggleSeat = (seat: SeatDto) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const getSeatClass = (seat: SeatDto) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    let classNames = [styles.seat, styles.seatAvailable];

    if (seat.seatType === "VIP") {
      classNames.push(styles.seatVip);
      if (isSelected) {
        classNames.push(styles.seatVipSelected);
      }
    } else if (seat.seatType === "COUPLE") {
      classNames.push(styles.seatCouple);
      if (isSelected) {
        classNames.push(styles.seatSelected); // Assuming same select style
      }
    } else {
      classNames.push(styles.seatStandard);
      if (isSelected) {
        classNames.push(styles.seatSelected);
      }
    }

    // We will add occupied logic later when the user provides the booked seats API
    // if (isOccupied) { classNames.push(styles.seatOccupied); }

    return classNames.join(" ");
  };

  const getSeatContent = (seat: SeatDto) => {
    return (
      <>
        <span className={styles.seatNumber}>{seat.seatNumber}</span>
        {seat.seatType === "VIP" && (
          <span className={`material-symbols-outlined ${styles.seatBadge}`}>
            star
          </span>
        )}
        {seat.seatType === "COUPLE" && (
          <span className={`material-symbols-outlined ${styles.seatBadge}`}>
            favorite
          </span>
        )}
      </>
    );
  };

  const calculateTotal = () => {
    // Placeholder prices
    let total = 0;
    selectedSeats.forEach((seat) => {
      if (seat.seatType === "VIP") total += 24;
      else if (seat.seatType === "COUPLE") total += 30;
      else total += 15;
    });
    return total;
  };

  if (!auditoriumId) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.loadingState}>
          <p>Thiếu thông tin phòng chiếu.</p>
          <button onClick={() => navigate(-1)}>Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.mainContent}>
        {/* Left Column: Seat Map (70%) */}
        <section className={styles.leftColumn}>
          {/* Screen Indicator */}
          <div className={styles.screenIndicatorWrapper}>
            <div className={styles.screenCurve}></div>
            <p className={styles.screenText}>Màn hình</p>
          </div>

          {/* Seat Map Area */}
          <div className={styles.seatMapArea}>
            {loading ? (
              <div className={styles.spinner}>
                <span className="material-symbols-outlined">sync</span>
              </div>
            ) : seatRows.length === 0 ? (
              <p style={{ color: "var(--color-on-surface-variant)" }}>
                Chưa có cấu hình ghế ngồi.
              </p>
            ) : (
              seatRows.map((row) => (
                <div key={row.rowLetter} className={styles.seatRow}>
                  <span className={styles.seatRowLabel}>{row.rowLetter}</span>
                  <div className={styles.seatGroup}>
                    {row.seats.map((seat) => (
                      <button
                        key={seat.id}
                        aria-label={`Ghế ${row.rowLetter}${seat.seatNumber}`}
                        className={getSeatClass(seat)}
                        onClick={() => toggleSeat(seat)}
                      >
                        {getSeatContent(seat)}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Legend */}
          <div className={styles.legendArea}>
            <div className={styles.legendItem}>
              <div className={styles.legendBoxAvailable}></div>
              <span>Trống</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendBoxSelected}></div>
              <span>Đang chọn</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendBoxOccupied}>
                <span
                  className={`material-symbols-outlined ${styles.legendIcon}`}
                >
                  close
                </span>
              </div>
              <span>Đã bán</span>
            </div>
            <div className={styles.legendDivider}></div>
            <div className={styles.legendItem}>
              <div className={styles.legendBoxVip}>
                <span
                  className={`material-symbols-outlined ${styles.legendIconVip}`}
                >
                  star
                </span>
              </div>
              <span>VIP</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendBoxCouple}></div>
              <span>Couple</span>
            </div>
          </div>
        </section>

        {/* Right Column: Checkout Sidebar (30%) */}
        <aside className={styles.rightColumn}>
          <div className={styles.glassPanel}>
            {/* Movie Info */}
            <div className={styles.movieInfoBox}>
              <div
                className={styles.moviePoster}
                style={{
                  backgroundImage: `url('${movie?.poster || "https://placehold.co/400x600/1E1B1B/FFFFFF?text=Poster"}')`,
                }}
              ></div>
              <div className={styles.movieDetails}>
                <h2 className={styles.movieTitle}>
                  {movie?.title || "Phim đang chọn"}
                </h2>
                <p className={styles.movieDetailText}>
                  <span
                    className={`material-symbols-outlined ${styles.movieDetailIcon}`}
                  >
                    location_on
                  </span>
                  {cinemaName || "Cineplex"}
                </p>
                <p className={styles.movieDetailText}>
                  <span
                    className={`material-symbols-outlined ${styles.movieDetailIcon}`}
                  >
                    calendar_today
                  </span>
                  {formatDateVN(showtime?.date)}
                </p>
                <p className={styles.movieDetailText}>
                  <span
                    className={`material-symbols-outlined ${styles.movieDetailIcon}`}
                  >
                    schedule
                  </span>
                  {showtime?.startTime
                    ? showtime.startTime.substring(0, 5)
                    : "Giờ chiếu"}
                </p>
              </div>
            </div>

            {/* Ticket Summary */}
            <div className={styles.ticketSummarySection}>
              <h3 className={styles.ticketSummaryTitle}>Vé đang chọn</h3>
              <ul className={styles.ticketList}>
                {selectedSeats.length === 0 ? (
                  <li
                    style={{
                      color: "var(--color-on-surface-variant)",
                      fontSize: "0.875rem",
                    }}
                  >
                    Chưa có ghế nào được chọn.
                  </li>
                ) : (
                  selectedSeats.map((seat) => (
                    <li key={seat.id} className={styles.ticketItem}>
                      <div>
                        <span className={styles.ticketSeatId}>
                          Ghế {seat.rowLetter}
                          {seat.seatNumber}
                        </span>
                        <span className={styles.ticketSeatType}>
                          {seat.seatType}
                        </span>
                      </div>
                      <span className={styles.ticketPrice}>
                        $
                        {seat.seatType === "VIP"
                          ? 24
                          : seat.seatType === "COUPLE"
                            ? 30
                            : 15}
                        .00
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Totals & CTA */}
            <div className={styles.checkoutSection}>
              <div className={styles.totalsRow}>
                <span className={styles.totalLabel}>Tổng cộng</span>
                <span className={styles.totalValue}>
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <button
                className={styles.proceedBtn}
                disabled={selectedSeats.length === 0}
              >
                Thanh toán
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className={styles.reservedTimeText}>
                Thời gian giữ ghế: 05:00
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default BookingPage;
