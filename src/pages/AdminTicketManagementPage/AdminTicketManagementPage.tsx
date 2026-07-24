import React, { useState, useEffect } from "react";
import styles from "./AdminTicketManagementPage.module.css";
import { managementService } from "../../services/management.service";
import {
  PurchaseDetailDto,
  BookingStatus,
  BookingStatusText,
} from "../../types/booking";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../api/types";
import { CommonUtils } from "../../utils/CommonUtils";

const AdminTicketManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [bookings, setBookings] = useState<PurchaseDetailDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBookingToCancel, setSelectedBookingToCancel] =
    useState<PurchaseDetailDto | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const payload = {
          keyword: searchQuery || undefined,
          status: selectedStatus || undefined,
          page: page,
          size: 10,
        };
        const response = await managementService.searchBookings(payload);
        setBookings(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotalElements(response.totalElements || 0);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast.error(getApiErrorMessage(error, "Không thể tải danh sách vé."));
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBookings();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedStatus, page, refreshKey]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.pageTitle}>Quản lý vé</h2>
        </div>
      </div>

      <div className={`${styles.glassPanel} ${styles.filterBar}`}>
        <div className={styles.searchContainer}>
          <input
            className={styles.searchInput}
            placeholder="Tìm theo mã vé..."
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>

        <div className={styles.filtersWrapper}>
          <div className={styles.roleFilter}>
            <span className={styles.roleLabel}>Trạng thái:</span>
            <div className={styles.selectWrapper}>
              <select
                className={styles.roleSelect}
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(0);
                }}
              >
                <option value="">Tất cả trạng thái</option>
                {Object.values(BookingStatus).map((status) => (
                  <option key={status} value={status}>
                    {BookingStatusText[status]}
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
      </div>

      <div className={`${styles.glassPanel} ${styles.tableContainer}`}>
        <div className={styles.tableScroll}>
          <table className={styles.userTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th style={{ width: "10%" }}>Mã Đơn</th>
                <th style={{ width: "25%" }}>Phim</th>
                <th style={{ width: "20%" }}>Suất Chiếu</th>
                <th style={{ width: "14%" }}>Rạp / Phòng</th>
                <th style={{ width: "8%" }} className={styles.alignRight}>
                  Tổng Tiền
                </th>
                <th style={{ width: "15%" }} className={styles.alignRight}>
                  Trạng Thái
                </th>
                <th style={{ width: "8%" }} className={styles.alignRight}>
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <div className={styles.emptyState}>
                      <div className={styles.loadingSpinner}></div>
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.code} className={styles.tableRow}>
                    <td>
                      <span className={styles.usernameCell}>
                        {booking.code}
                      </span>
                    </td>
                    <td>{booking.showtime?.movie?.title || "N/A"}</td>
                    <td>
                      {CommonUtils.formatShortDateVN(booking.showtime?.date)}{" "}
                      <br />
                      <span className={styles.emailCell}>
                        {booking.showtime?.startTime?.slice(0, 5)}
                      </span>
                    </td>
                    <td>
                      {booking.showtime?.auditorium?.cinema?.name}
                      <br />
                      {booking.showtime?.auditorium?.name}
                    </td>
                    <td className={styles.alignRight}>
                      {CommonUtils.formatNumberVietnamese(booking.grandTotal)}
                    </td>
                    <td className={styles.alignRight}>
                      <span
                        className={`${styles.badge} ${
                          booking.status === BookingStatus.PAID
                            ? styles.badgeActive
                            : booking.status === BookingStatus.CANCELLED
                              ? styles.badgeInactive
                              : styles.badgeStandard
                        }`}
                      >
                        {booking.status
                          ? BookingStatusText[booking.status] || booking.status
                          : "N/A"}
                      </span>
                    </td>
                    <td className={styles.alignRight}>
                      <div className={styles.actions}>
                        {booking.status !== BookingStatus.CANCELLED && (
                          <button
                            className={styles.btnTune}
                            title="Hủy vé"
                            onClick={() => {
                              setSelectedBookingToCancel(booking);
                              setIsCancelModalOpen(true);
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{
                                color: "var(--color-error)",
                                fontSize: "20px",
                              }}
                            >
                              cancel
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className={styles.emptyState}>
                      <span className="material-symbols-outlined">
                        receipt_long
                      </span>
                      <p>Không tìm thấy vé nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <span className={styles.paginationText}>
            Hiển thị trang {page + 1} / {totalPages} (Tổng: {totalElements})
          </span>
          <div className={styles.paginationControls}>
            <button
              className={styles.btnPageNav}
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                chevron_left
              </span>
            </button>
            <div className={styles.pageNumbers}>
              <button className={`${styles.btnPageNum} ${styles.active}`}>
                {page + 1}
              </button>
            </div>
            <button
              className={styles.btnPageNav}
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {isCancelModalOpen && selectedBookingToCancel && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isCancelling && setIsCancelModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "450px" }}
          >
            <div className={styles.modalHeader}>
              <h3>Xác nhận hủy vé</h3>
              <button
                className={styles.btnClose}
                onClick={() => !isCancelling && setIsCancelModalOpen(false)}
                disabled={isCancelling}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p
                style={{
                  marginBottom: "1.5rem",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Bạn có chắc chắn muốn hủy đơn vé này không? Hành động này không
                thể hoàn tác.
              </p>

              <div
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-surface-container-high) 50%, transparent)",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--color-on-surface-variant)" }}>
                    Mã đơn:
                  </span>
                  <strong style={{ color: "var(--color-on-surface)" }}>
                    {selectedBookingToCancel.code}
                  </strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--color-on-surface-variant)" }}>
                    Phim:
                  </span>
                  <strong
                    style={{
                      color: "var(--color-on-surface)",
                      textAlign: "right",
                    }}
                  >
                    {selectedBookingToCancel.showtime?.movie?.title}
                  </strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--color-on-surface-variant)" }}>
                    Suất chiếu:
                  </span>
                  <strong
                    style={{
                      color: "var(--color-on-surface)",
                      textAlign: "right",
                    }}
                  >
                    {CommonUtils.formatShortDateVN(
                      selectedBookingToCancel.showtime?.date,
                    )}
                    <br />
                    {selectedBookingToCancel.showtime?.startTime?.slice(0, 5)}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                    paddingTop: "0.5rem",
                    borderTop: "1px dashed var(--color-outline-variant)",
                  }}
                >
                  <span style={{ color: "var(--color-on-surface-variant)" }}>
                    Tổng tiền:
                  </span>
                  <strong
                    style={{
                      color: "var(--color-error)",
                      fontSize: "1.125rem",
                    }}
                  >
                    {CommonUtils.formatNumberVietnamese(
                      selectedBookingToCancel.grandTotal,
                    )}
                  </strong>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={isCancelling}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    border: "1px solid var(--color-outline)",
                    backgroundColor: "transparent",
                    color: "var(--color-on-surface)",
                  }}
                >
                  Đóng
                </button>
                <button
                  onClick={async () => {
                    setIsCancelling(true);
                    try {
                      await managementService.cancelBooking(
                        selectedBookingToCancel.code,
                      );
                      toast.success("Hủy vé thành công");
                      setRefreshKey((prev) => prev + 1);
                      setIsCancelModalOpen(false);
                    } catch (error) {
                      toast.error(
                        getApiErrorMessage(error, "Hủy vé thất bại."),
                      );
                    } finally {
                      setIsCancelling(false);
                    }
                  }}
                  disabled={isCancelling}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    cursor: isCancelling ? "not-allowed" : "pointer",
                    backgroundColor: "var(--color-error)",
                    color: "#fff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  {isCancelling ? "Đang xử lý..." : "Xác nhận hủy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicketManagementPage;
