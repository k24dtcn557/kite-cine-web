import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AdminAddShowtimePage.module.css";
import { movieService } from "../../services/movie.service";
import { MovieDto } from "../../types/movie";
import { cinemaService } from "../../services/cinema.service";
import { AuditoriumDto } from "../../types/cinema";
import { CinemaDto } from "../../types/cinema";
import { priceModelService } from "../../services/price-model.service";
import { PriceModelDto, PRICE_MODEL_SEAT_TYPES } from "../../types/showtime";
import { showTimeService } from "../../services/show-time.service";
import { CommonUtils } from "../../utils/CommonUtils";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const AdminAddShowtimePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDto | null>(null);
  const [cinemas, setCinemas] = useState<CinemaDto[]>([]);
  const [auditoriums, setAuditoriums] = useState<AuditoriumDto[]>([]);
  const [priceModels, setPriceModels] = useState<PriceModelDto[]>([]);

  const [selectedCinemaId, setSelectedCinemaId] = useState<number | "">("");
  const [selectedAuditoriumId, setSelectedAuditoriumId] = useState<number | "">(
    "",
  );
  const [selectedPriceModelId, setSelectedPriceModelId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [confirmModalData, setConfirmModalData] = useState<{
    timeStr: string;
    date: Date;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate 14 days for the weekly preview
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const [occupiedSlots, setOccupiedSlots] = useState<
    { id: number; start: string; end: string; title: string }[]
  >([]);

  const fetchShowTimes = async () => {
    if (!selectedAuditoriumId) {
      setOccupiedSlots([]);
      return;
    }
    try {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const dd = String(selectedDate.getDate()).padStart(2, "0");
      const dateString = `${yyyy}-${mm}-${dd}`;

      const data = await showTimeService.getShowTimesByAuditoriumAndDate(
        selectedAuditoriumId as number,
        dateString,
      );

      const mapped = (data || []).map((st: any) => ({
        id: st.id,
        start: (st.startTime || "00:00").substring(0, 5),
        end: (st.endTime || "00:00").substring(0, 5),
        title: st.movieTitle || "Suất chiếu khác",
      }));
      setOccupiedSlots(mapped);
    } catch (error) {
      console.error("Failed to fetch showtimes", error);
      toast.error("Không thể tải lịch chiếu");
    }
  };

  useEffect(() => {
    fetchShowTimes();
  }, [selectedAuditoriumId, selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          const fetchedMovie = await movieService.getMovieById(Number(id));
          setMovie(fetchedMovie);
        }
        const fetchedCinemas = await cinemaService.getCinemas();
        setCinemas(fetchedCinemas);
        const fetchedPriceModels = await priceModelService.searchPriceModels({
          page: 0,
          size: 100,
        });
        setPriceModels(fetchedPriceModels.data || []);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchAuditoriums = async () => {
      if (selectedCinemaId) {
        try {
          const response = await cinemaService.searchAuditoriums({
            cinemaId: selectedCinemaId as number,
            page: 0,
            size: 100,
          });
          setAuditoriums(response.data || []);
          setSelectedAuditoriumId("");
        } catch (error) {
          console.error("Failed to fetch auditoriums", error);
        }
      } else {
        setAuditoriums([]);
        setSelectedAuditoriumId("");
      }
    };
    fetchAuditoriums();
  }, [selectedCinemaId]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const getDayName = (date: Date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };

  // Convert time "HH:mm" to a percentage for Gantt placement (assuming 08:00 to 24:00 timeline)
  const timeToPercentage = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startOffset = 8 * 60; // 08:00 start
    const endOffset = 24 * 60; // 24:00 end

    if (totalMinutes < startOffset) return 0;

    const percentage =
      ((totalMinutes - startOffset) / (endOffset - startOffset)) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  const handleGanttClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedAuditoriumId) {
      toast.error("Vui lòng chọn phòng chiếu");
      return;
    }
    if (!selectedPriceModelId) {
      toast.error("Vui lòng chọn bảng giá");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;

    const startOffset = 8 * 60; // 08:00
    const endOffset = 24 * 60; // 24:00
    let totalMinutes = startOffset + percentage * (endOffset - startOffset);
    totalMinutes = Math.round(totalMinutes / 15) * 15;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    setConfirmModalData({
      timeStr,
      date: selectedDate,
    });
  };

  const handleCreateShowTime = async () => {
    if (
      !confirmModalData ||
      !movie ||
      !selectedAuditoriumId ||
      !selectedPriceModelId
    )
      return;

    setIsSubmitting(true);
    try {
      const { date, timeStr } = confirmModalData;
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateString = `${yyyy}-${mm}-${dd}`;
      const startTimeString = `${timeStr}:00`;

      await showTimeService.createShowTime({
        date: dateString,
        startTime: startTimeString,
        movieId: movie.id,
        auditoriumId: selectedAuditoriumId as number,
        priceModelId: Number(selectedPriceModelId),
      });

      toast.success("Tạo suất chiếu thành công!");
      setConfirmModalData(null);
      fetchShowTimes();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Lỗi khi tạo suất chiếu");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !movie) {
    return (
      <div className={styles.loadingState}>
        <span className={`material-symbols-outlined ${styles.spinner}`}>
          sync
        </span>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  const selectedPriceModel = priceModels.find(
    (pm) => String(pm.id) === String(selectedPriceModelId),
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <nav className={styles.breadcrumb}>
            <span
              className={styles.breadcrumbLink}
              onClick={() => navigate("/admin/movies")}
            >
              Danh sách Phim
            </span>
            <span
              className={`material-symbols-outlined ${styles.breadcrumbIcon}`}
            >
              chevron_right
            </span>
            <span
              className={styles.breadcrumbLink}
              onClick={() => navigate(`/admin/movies/${id}/showtimes`)}
            >
              Lịch chiếu
            </span>
            <span
              className={`material-symbols-outlined ${styles.breadcrumbIcon}`}
            >
              chevron_right
            </span>
            <span className={styles.breadcrumbCurrent}>
              Thêm lịch chiếu mới
            </span>
          </nav>
        </div>
      </div>

      <div className={styles.topSection}>
        <div className={styles.leftCol}>
          {/* Movie Context */}
          <div className={styles.movieCard}>
            <img
              src={movie.poster}
              alt={movie.title}
              className={styles.moviePoster}
            />
            <div className={styles.movieInfo}>
              <h3>{movie.title}</h3>
              <p>{movie.runtime} phút</p>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Bảng giá</label>
            <div className={styles.selectWrapper}>
              <select
                className={styles.selectField}
                value={selectedPriceModelId}
                onChange={(e) => setSelectedPriceModelId(e.target.value)}
              >
                <option value="">-- Chọn bảng giá --</option>
                {priceModels.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name}
                  </option>
                ))}
              </select>
              <span
                className={`material-symbols-outlined ${styles.selectIcon}`}
              >
                expand_more
              </span>
            </div>
            {selectedPriceModel && (
              <div className={styles.priceList}>
                {PRICE_MODEL_SEAT_TYPES.map(({ type, label }) => {
                  const price = selectedPriceModel.prices[type] || 0;
                  return (
                    <div key={type} className={styles.priceItem}>
                      <span className={styles.priceType}>{label}</span>
                      <span className={styles.priceValue}>
                        {CommonUtils.formatNumberVietnamese(price)} đ
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* Right Section: Selectors & Dates */}
        <div className={styles.rightCol}>
          {/* Location Selectors */}
          <div className={styles.selectorsCard}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Chọn Rạp</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.selectField}
                  value={selectedCinemaId}
                  onChange={(e) =>
                    setSelectedCinemaId(Number(e.target.value) || "")
                  }
                >
                  <option value="">-- Chọn rạp --</option>
                  {cinemas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span
                  className={`material-symbols-outlined ${styles.selectIcon}`}
                >
                  expand_more
                </span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Chọn Phòng chiếu</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.selectField}
                  value={selectedAuditoriumId}
                  onChange={(e) =>
                    setSelectedAuditoriumId(Number(e.target.value) || "")
                  }
                  disabled={!selectedCinemaId}
                >
                  <option value="">-- Chọn phòng --</option>
                  {auditoriums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type})
                    </option>
                  ))}
                </select>
                <span
                  className={`material-symbols-outlined ${styles.selectIcon}`}
                >
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Date Selector Section */}
          <div className={styles.dateSection}>
            <h2 className={styles.sectionTitle}>Chọn ngày</h2>
            <div className={styles.dateScroller}>
              {dates.map((date, idx) => {
                const isSelected =
                  selectedDate.getDate() === date.getDate() &&
                  selectedDate.getMonth() === date.getMonth();
                return (
                  <div
                    key={idx}
                    className={`${styles.dateItem} ${isSelected ? styles.dateItemSelected : ""}`}
                    onClick={() => handleDateSelect(date)}
                  >
                    <span className={styles.dayName}>{getDayName(date)}</span>
                    <span className={styles.dayNumber}>
                      {date.getDate()}
                      <span className={styles.monthText}>
                        /{date.getMonth() + 1}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Chart Section */}
      <div className={styles.ganttSection}>
        <h2 className={styles.sectionTitle}>Lịch chiếu trong ngày</h2>
        <div className={styles.ganttContainer}>
          {/* Time markers 08:00 - 24:00 */}
          <div className={styles.ganttHeader}>
            {Array.from({ length: 65 }).map((_, i) => {
              const isHour = i % 4 === 0;
              return (
                <div
                  key={i}
                  className={`${styles.timeTick} ${isHour ? styles.timeTickMajor : styles.timeTickMinor}`}
                  style={{ left: `${(i / 64) * 100}%` }}
                >
                  {isHour && (
                    <span className={styles.timeMarkerText}>
                      {(i / 4 + 8).toString().padStart(2, "0")}:00
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timeline Row */}
          <div className={styles.ganttRow} onClick={handleGanttClick}>
            {/* Render occupied slots */}
            {occupiedSlots.map((slot) => {
              const startPct = timeToPercentage(slot.start);
              const endPct = timeToPercentage(slot.end);
              const width = endPct - startPct;

              return (
                <div
                  key={slot.id}
                  className={styles.occupiedSlot}
                  style={{ left: `${startPct}%`, width: `${width}%` }}
                  title={`${slot.title} (${slot.start} - ${slot.end})`}
                >
                  <div className={styles.slotContent}>
                    <span className={styles.slotTitleText}>{slot.title}</span>
                    <span className={styles.slotTimeText}>
                      {slot.start} - {slot.end}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModalData &&
        createPortal(
          <div
            className={styles.modalOverlay}
            onClick={() => !isSubmitting && setConfirmModalData(null)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.modalTitle}>Xác nhận tạo suất chiếu</h3>
              <div className={styles.confirmDetails}>
                <p>
                  <strong>Phim:</strong> {movie?.title}
                </p>
                <p>
                  <strong>Rạp:</strong>{" "}
                  {cinemas.find((c) => c.id === selectedCinemaId)?.name}
                </p>
                <p>
                  <strong>Phòng chiếu:</strong>{" "}
                  {auditoriums.find((a) => a.id === selectedAuditoriumId)?.name}
                </p>
                <p>
                  <strong>Bảng giá:</strong>{" "}
                  {
                    priceModels.find(
                      (pm) => String(pm.id) === String(selectedPriceModelId),
                    )?.name
                  }
                </p>
                <p>
                  <strong>Ngày:</strong>{" "}
                  {CommonUtils.formatDateVietnamese(
                    confirmModalData.date.toISOString(),
                  )}
                </p>
                <p>
                  <strong>Giờ bắt đầu:</strong> {confirmModalData.timeStr}
                </p>
              </div>
              <div className={styles.modalActions}>
                <button
                  className={`${styles.btn} ${styles.btnCancel}`}
                  onClick={() => setConfirmModalData(null)}
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={handleCreateShowTime}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default AdminAddShowtimePage;
