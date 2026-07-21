import React, { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import styles from "./BookingPage.module.css";
import { Navbar, LoginForm, SignUpForm } from "../../components";
import { useAuth } from "../../contexts/AuthContext";
import { cinemaService, SeatRowDto, SeatDto } from "../../api/cinema.service";
import { MovieDto } from "../../api/movie.service";
import { ShowTimeBriefDto } from "../../api/show-time.service";
import { ticketService, TicketDto } from "../../api/ticket.service";
import { bookingService } from "../../api/booking.service";
import { toast } from "react-hot-toast";
import { CommonUtils } from "../../utils/CommonUtils";
import { PRICE_MODEL_SEAT_TYPES } from "../../api/price-model.service";

const getSeatTypeLabel = (type: string) => {
  return PRICE_MODEL_SEAT_TYPES.find((t) => t.type === type)?.label || type;
};

const BookingPage: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthLoading, isAuthenticated]);

  const movie = location.state?.movie as MovieDto | undefined;
  const cinemaName = location.state?.cinemaName as string | undefined;
  const cinemaAddress = location.state?.cinemaAddress as string | undefined;
  const auditoriumId = location.state?.auditoriumId as number | undefined;
  const auditoriumName = location.state?.auditoriumName as string | undefined;
  const showtime = location.state?.showtime as ShowTimeBriefDto | undefined;

  const [seatRows, setSeatRows] = useState<SeatRowDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<TicketDto[]>([]);
  const [bookedTickets, setBookedTickets] = useState<TicketDto[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (selectedTickets.length === 0) {
      setTimeLeft(null);
      return;
    }

    const earliestTicket = selectedTickets.reduce((earliest, ticket) => {
      return new Date(ticket.expirationTime) < new Date(earliest.expirationTime)
        ? ticket
        : earliest;
    }, selectedTickets[0]);

    const targetTime = new Date(earliestTicket.expirationTime).getTime();

    const handleTimeout = async () => {
      toast.error("Hết thời gian giữ ghế, vui lòng chọn lại!");
      try {
        await Promise.all(
          selectedTickets.map((t) => ticketService.unreserveTicket(t.id)),
        );
      } catch (e) {
        console.error("Failed to unreserve on timeout", e);
      }
      setSelectedTickets([]);

      if (showtimeId) {
        try {
          const booked = await ticketService.getBookedTickets(
            parseInt(showtimeId, 10),
          );
          setBookedTickets(booked || []);
        } catch (e) {}
      }
    };

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;
      if (diff <= 0) {
        setTimeLeft(0);
        return true; // Expired
      }
      setTimeLeft(Math.floor(diff / 1000));
      return false; // Not expired
    };

    const isExpiredInitially = updateTimer();
    if (isExpiredInitially) {
      handleTimeout();
      return;
    }

    const interval = setInterval(() => {
      const expired = updateTimer();
      if (expired) {
        clearInterval(interval);
        handleTimeout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTickets, showtimeId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!auditoriumId || !showtimeId) return;
      try {
        setLoading(true);
        const [rows, holdings, booked] = await Promise.all([
          cinemaService.getPublicAuditoriumSeats(auditoriumId),
          ticketService.getMyHoldings(parseInt(showtimeId, 10)),
          ticketService.getBookedTickets(parseInt(showtimeId, 10)),
        ]);
        setSeatRows(rows || []);
        setSelectedTickets(holdings || []);
        setBookedTickets(booked || []);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [auditoriumId, showtimeId]);

  const handleRemoveTicket = async (ticket: TicketDto) => {
    const loadingToastId = toast.loading("Đang bỏ chọn ghế...");
    try {
      await ticketService.unreserveTicket(ticket.id);
      setSelectedTickets((prev) => prev.filter((t) => t.id !== ticket.id));
      toast.success(`Đã bỏ chọn ghế ${ticket.rowLetter}${ticket.seatNumber}`, {
        id: loadingToastId,
      });
    } catch (error) {
      console.error("Failed to unreserve ticket", error);
      toast.error("Không thể bỏ chọn ghế. Vui lòng thử lại.", {
        id: loadingToastId,
      });
    }
  };

  const toggleSeat = async (seat: SeatDto) => {
    const isBooked = bookedTickets.some((t) => t.seatId === seat.id);
    if (isBooked) {
      toast.error("Ghế này đã có người đặt.");
      return;
    }

    const exists = selectedTickets.find((t) => t.seatId === seat.id);
    if (exists) {
      handleRemoveTicket(exists);
    } else {
      if (!showtimeId) {
        toast.error("Thiếu thông tin suất chiếu.");
        return;
      }
      const loadingToastId = toast.loading("Đang giữ chỗ...");
      try {
        const rawTicket = await ticketService.reserveSeat({
          showtimeId: parseInt(showtimeId, 10),
          seatId: seat.id,
        });
        const ticket: TicketDto = {
          ...rawTicket,
          rowLetter: rawTicket.rowLetter || seat.rowLetter,
          seatNumber: rawTicket.seatNumber || String(seat.seatNumber),
          seatType: rawTicket.seatType || seat.seatType,
          purchasePrice: rawTicket.purchasePrice,
        };
        setSelectedTickets((prev) => [...prev, ticket]);
        toast.success(`Đã chọn ghế ${seat.rowLetter}${seat.seatNumber}`, {
          id: loadingToastId,
        });
      } catch (error) {
        console.error("Failed to reserve seat", error);
        toast.error("Ghế này đã có người đặt hoặc xảy ra lỗi.", {
          id: loadingToastId,
        });
      }
    }
  };

  const getSeatClass = (seat: SeatDto) => {
    const isSelected = selectedTickets.some((t) => t.seatId === seat.id);
    const isBooked = bookedTickets.some((t) => t.seatId === seat.id);
    let classNames = [styles.seat];

    if (isBooked) {
      classNames.push(styles.seatOccupied);
    } else {
      classNames.push(styles.seatAvailable);
    }

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

    return classNames.join(" ");
  };

  const getSeatContent = (seat: SeatDto) => {
    const isBooked = bookedTickets.some((t) => t.seatId === seat.id);
    return (
      <>
        {isBooked ? (
          <span
            className={`material-symbols-outlined ${styles.seatBadge}`}
            style={{
              fontSize: "1rem",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bottom: "auto",
              right: "auto",
            }}
          >
            close
          </span>
        ) : (
          <span className={styles.seatNumber}>{seat.seatNumber}</span>
        )}
        {!isBooked && seat.seatType === "VIP" && (
          <span className={`material-symbols-outlined ${styles.seatBadge}`}>
            star
          </span>
        )}
        {!isBooked && seat.seatType === "COUPLE" && (
          <span className={`material-symbols-outlined ${styles.seatBadge}`}>
            favorite
          </span>
        )}
      </>
    );
  };

  const calculateTotal = () => {
    return selectedTickets.reduce(
      (acc, ticket) => acc + ticket.purchasePrice,
      0,
    );
  };

  if (!auditoriumId) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.loadingState}>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "4rem",
              color: "var(--color-primary)",
              marginBottom: "1rem",
            }}
          >
            error
          </span>
          <h2
            style={{
              color: "var(--color-on-surface)",
              marginBottom: "0.5rem",
              fontSize: "1.5rem",
            }}
          >
            Thiếu thông tin phòng chiếu
          </h2>
          <p
            style={{
              color: "var(--color-on-surface-variant)",
              marginBottom: "2rem",
              textAlign: "center",
              maxWidth: "400px",
              lineHeight: "1.5",
            }}
          >
            Không thể tải sơ đồ ghế ngồi do thiếu thông tin. Vui lòng quay lại
            chọn lại suất chiếu!
          </p>
          <button
            className={styles.proceedBtn}
            onClick={() => navigate(-1)}
            style={{ width: "auto", padding: "0.75rem 2.5rem" }}
          >
            Quay lại
          </button>
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
            <p className={styles.screenText}>Màn hình chiếu phim</p>
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
            <div
              style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}
            >
              <div className={styles.legendItem}>
                <div className={styles.legendBoxSelected}></div>
                <span>Đang chọn</span>
              </div>
              <div className={styles.legendItem}>
                <div
                  className={`${styles.legendBoxOccupied} ${styles.seatOccupied}`}
                >
                  <span
                    className={`material-symbols-outlined ${styles.legendIcon}`}
                  >
                    close
                  </span>
                </div>
                <span>Đã bán</span>
              </div>
            </div>

            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: "1.5rem",
                alignItems: "center",
              }}
            >
              <div className={styles.legendItem}>
                <div className={styles.legendBoxAvailable}></div>
                <span>{getSeatTypeLabel("STANDARD")}</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendBoxVip}>
                  <span
                    className={`material-symbols-outlined ${styles.legendIconVip}`}
                  >
                    star
                  </span>
                </div>
                <span>{getSeatTypeLabel("VIP")}</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendBoxCouple}></div>
                <span>{getSeatTypeLabel("COUPLE")}</span>
              </div>
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
                <h2 className={styles.movieTitle}>{movie?.title}</h2>
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
                    className={`material-symbols-outlined ${styles.movieDetailIcon}`}
                  >
                    calendar_today
                  </span>
                  {CommonUtils.formatDateVN(showtime?.date)}
                </p>
                <p className={styles.movieDetailText}>
                  <span
                    className={`material-symbols-outlined ${styles.movieDetailIcon}`}
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

            {/* Ticket Summary */}
            <div className={styles.ticketSummarySection}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h3 className={styles.ticketSummaryTitle} style={{ margin: 0 }}>
                  Vé đang chọn
                </h3>
                {timeLeft !== null && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      color: "var(--color-primary)",
                    }}
                  >
                    <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                      {formatTime(timeLeft)}
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "1.2rem" }}
                    >
                      timer
                    </span>
                  </div>
                )}
              </div>
              <ul className={styles.ticketList}>
                {selectedTickets.length === 0 ? (
                  <li
                    style={{
                      color: "var(--color-on-surface-variant)",
                      fontSize: "0.875rem",
                    }}
                  >
                    Chưa có ghế nào được chọn.
                  </li>
                ) : (
                  selectedTickets.map((ticket) => (
                    <li key={ticket.id} className={styles.ticketItem}>
                      <div>
                        <span className={styles.ticketSeatId}>
                          Ghế {ticket.rowLetter}
                          {ticket.seatNumber}
                        </span>
                        <span className={styles.ticketSeatType}>
                          {getSeatTypeLabel(ticket.seatType)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span className={styles.ticketPrice}>
                          {CommonUtils.formatNumberVietnamese(
                            ticket.purchasePrice,
                          )}
                        </span>
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleRemoveTicket(ticket)}
                          aria-label="Bỏ chọn vé"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "1.25rem" }}
                          >
                            delete
                          </span>
                        </button>
                      </div>
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
                  {CommonUtils.formatNumberVietnamese(calculateTotal())}
                </span>
              </div>
              <button
                className={styles.proceedBtn}
                disabled={selectedTickets.length === 0 || isInitializing}
                onClick={async () => {
                  if (!isAuthenticated) {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  } else {
                    try {
                      setIsInitializing(true);
                      const ticketIds = selectedTickets.map((t) => t.id);
                      const bookingData =
                        await bookingService.initializeBooking({ ticketIds });
                      navigate("/checkout", {
                        state: {
                          movie,
                          cinemaName,
                          cinemaAddress,
                          auditoriumName,
                          showtime,
                          selectedTickets,
                          bookingData,
                        },
                      });
                    } catch (error) {
                      toast.error(
                        "Không thể khởi tạo giao dịch. Vui lòng thử lại sau.",
                      );
                      console.error(error);
                    } finally {
                      setIsInitializing(false);
                    }
                  }
                }}
              >
                {isInitializing ? "Đang xử lý..." : "Thanh toán"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className={styles.reservedTimeText}>
                Thời gian giữ ghế: 05:00
              </p>
            </div>
          </div>
        </aside>
      </main>

      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: "30rem" }}
          >
            {authMode === "login" ? (
              <LoginForm
                onLoginSuccess={() => setShowAuthModal(false)}
                onSignUp={() => setAuthMode("signup")}
                onForgotPassword={() => navigate("/forgot-password")}
              />
            ) : (
              <SignUpForm onLogIn={() => setAuthMode("login")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
