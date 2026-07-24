import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import styles from "./SeatMap.module.css";
import { cinemaService } from "../../../../services/cinema.service";
import {
  AuditoriumDto,
  SeatRowDto,
  SeatType,
  AUDITORIUM_TYPE_LABELS,
} from "../../../../types/cinema";
import { AuditoriumType } from "../../../../types/cinema";
import { getApiErrorMessage } from "../../../../api/types";

interface SeatMapProps {
  cinemaId?: number;
  auditorium?: AuditoriumDto;
  openAddRowModal?: (open: () => void) => void;
  openAddSeatModal?: (open: () => void) => void;
  openDeleteSeatsModal?: (open: () => void) => void;
  openChangeSeatTypeModal?: (open: () => void) => void;
  clearSelectionBridge?: (clear: () => void) => void;
  openSelectRowModal?: (open: () => void) => void;
  onAuditoriumUpdated?: (auditorium: AuditoriumDto) => void;
  onAuditoriumDeleted?: (auditoriumId: number) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({
  cinemaId,
  auditorium,
  openAddRowModal,
  openAddSeatModal,
  openDeleteSeatsModal,
  openChangeSeatTypeModal,
  clearSelectionBridge,
  openSelectRowModal,
  onAuditoriumUpdated,
  onAuditoriumDeleted,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<Set<number>>(new Set());
  const [seatRows, setSeatRows] = useState<SeatRowDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
  const [newRowLetter, setNewRowLetter] = useState("");
  const [newNumberOfSeats, setNewNumberOfSeats] = useState<number | "">("");
  const [newSeatType, setNewSeatType] = useState<SeatType>("STANDARD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addRowErrors, setAddRowErrors] = useState<{
    rowLetter?: string;
    numberOfSeats?: string;
  }>({});

  const [isAddSeatModalOpen, setIsAddSeatModalOpen] = useState(false);
  const [seatRowLetter, setSeatRowLetter] = useState("");
  const [seatNumber, setSeatNumber] = useState<number | "">("");
  const [seatType, setSeatType] = useState<SeatType>("STANDARD");
  const [isSeatSubmitting, setIsSeatSubmitting] = useState(false);
  const [addSeatErrors, setAddSeatErrors] = useState<{
    seatRowLetter?: string;
    seatNumber?: string;
  }>({});

  const [isDeleteSeatsModalOpen, setIsDeleteSeatsModalOpen] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  const [isChangeTypeModalOpen, setIsChangeTypeModalOpen] = useState(false);
  const [bulkSeatType, setBulkSeatType] = useState<SeatType>("STANDARD");
  const [isChangeTypeSubmitting, setIsChangeTypeSubmitting] = useState(false);

  const [isSelectRowModalOpen, setIsSelectRowModalOpen] = useState(false);
  const [selectedRowLetters, setSelectedRowLetters] = useState<Set<string>>(
    new Set(),
  );

  const [isDeleteAuditoriumModalOpen, setIsDeleteAuditoriumModalOpen] =
    useState(false);
  const [isDeleteAuditoriumSubmitting, setIsDeleteAuditoriumSubmitting] =
    useState(false);

  const [isEditAuditoriumModalOpen, setIsEditAuditoriumModalOpen] =
    useState(false);
  const [editAuditoriumName, setEditAuditoriumName] = useState("");
  const [editAuditoriumType, setEditAuditoriumType] =
    useState<AuditoriumType>("PREMIUM");
  const [editAuditoriumNameError, setEditAuditoriumNameError] = useState("");
  const [isEditAuditoriumSubmitting, setIsEditAuditoriumSubmitting] =
    useState(false);

  const AUDITORIUM_TYPES = Object.keys(
    AUDITORIUM_TYPE_LABELS,
  ) as AuditoriumType[];

  const totalSeats = useMemo(() => {
    return seatRows.reduce((acc, row) => acc + row.seats.length, 0);
  }, [seatRows]);

  const fetchSeats = useCallback(async () => {
    if (!auditorium) {
      setSeatRows([]);
      return;
    }
    try {
      setLoading(true);
      const data = await cinemaService.getAuditoriumSeats(auditorium.id);
      setSeatRows(data || []);
    } catch (error) {
      console.error("Failed to fetch auditorium seats", error);
      setSeatRows([]);
    } finally {
      setLoading(false);
    }
  }, [auditorium]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  // Expose modal-open functions to parent
  useEffect(() => {
    if (openAddRowModal) {
      openAddRowModal(() => setIsAddRowModalOpen(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAddRowModal]);

  useEffect(() => {
    if (openAddSeatModal) {
      openAddSeatModal(() => setIsAddSeatModalOpen(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAddSeatModal]);

  useEffect(() => {
    if (openDeleteSeatsModal) {
      openDeleteSeatsModal(() => {
        if (selectedSeats.size === 0) {
          toast.error("Vui lòng chọn ít nhất một ghế để xóa.");
          return;
        }
        setIsDeleteSeatsModalOpen(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDeleteSeatsModal, selectedSeats]);

  useEffect(() => {
    if (openChangeSeatTypeModal) {
      openChangeSeatTypeModal(() => {
        if (selectedSeats.size === 0) {
          toast.error("Vui lòng chọn ít nhất một ghế để đổi hạng.");
          return;
        }
        setIsChangeTypeModalOpen(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openChangeSeatTypeModal, selectedSeats]);

  useEffect(() => {
    if (clearSelectionBridge) {
      clearSelectionBridge(() => setSelectedSeats(new Set()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSelectionBridge]);

  useEffect(() => {
    if (openSelectRowModal) {
      openSelectRowModal(() => {
        if (seatRows.length === 0) {
          toast.error("Chưa có hàng ghế nào để chọn.");
          return;
        }
        setSelectedRowLetters(new Set());
        setIsSelectRowModalOpen(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSelectRowModal, seatRows]);

  const handleAddRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditorium) return;

    const errors: { rowLetter?: string; numberOfSeats?: string } = {};

    if (!newRowLetter.trim()) {
      errors.rowLetter = "Vui lòng nhập ký hiệu hàng ghế.";
    } else if (!/^[A-Za-z]+$/.test(newRowLetter)) {
      errors.rowLetter = "Ký hiệu hàng chỉ chứa chữ cái.";
    } else if (newRowLetter.length > 2) {
      errors.rowLetter = "Ký hiệu hàng tối đa 2 chữ cái.";
    }

    if (!newNumberOfSeats) {
      errors.numberOfSeats = "Vui lòng nhập số ghế.";
    } else if (Number(newNumberOfSeats) < 1 || Number(newNumberOfSeats) > 50) {
      errors.numberOfSeats = "Số ghế phải từ 1 đến 50.";
    }

    if (Object.keys(errors).length > 0) {
      setAddRowErrors(errors);
      return;
    }
    setAddRowErrors({});

    try {
      setIsSubmitting(true);
      await cinemaService.addRow({
        auditoriumId: auditorium.id,
        rowLetter: newRowLetter.toUpperCase(),
        numberOfSeats: Number(newNumberOfSeats),
        seatType: newSeatType,
      });
      setIsAddRowModalOpen(false);
      setNewRowLetter("");
      setNewNumberOfSeats("");
      setNewSeatType("STANDARD");
      fetchSeats();
      toast.success(
        `Đã thêm hàng ghế ${newRowLetter.toUpperCase()} thành công!`,
      );
    } catch (error) {
      console.error("Failed to add row", error);
      toast.error(
        getApiErrorMessage(error, "Thêm hàng ghế thất bại. Vui lòng thử lại."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditorium) return;

    const errors: { seatRowLetter?: string; seatNumber?: string } = {};

    if (!seatRowLetter.trim()) {
      errors.seatRowLetter = "Vui lòng nhập hàng.";
    } else if (!/^[A-Za-z]+$/.test(seatRowLetter)) {
      errors.seatRowLetter = "Hàng chỉ chứa chữ cái.";
    } else if (seatRowLetter.length > 2) {
      errors.seatRowLetter = "Hàng tối đa 2 chữ cái.";
    }

    if (!seatNumber) {
      errors.seatNumber = "Vui lòng nhập số ghế.";
    } else if (Number(seatNumber) < 1 || Number(seatNumber) > 999) {
      errors.seatNumber = "Số ghế phải từ 1 đến 999.";
    }

    if (Object.keys(errors).length > 0) {
      setAddSeatErrors(errors);
      return;
    }
    setAddSeatErrors({});

    try {
      setIsSeatSubmitting(true);
      await cinemaService.addSeat({
        auditoriumId: auditorium.id,
        rowLetter: seatRowLetter.toUpperCase(),
        seatNumber: Number(seatNumber),
        seatType,
      });
      setIsAddSeatModalOpen(false);
      setSeatRowLetter("");
      setSeatNumber("");
      setSeatType("STANDARD");
      fetchSeats();
      toast.success(
        `Đã thêm ghế ${seatRowLetter.toUpperCase()}${seatNumber} thành công!`,
      );
    } catch (error) {
      console.error("Failed to add seat", error);
      toast.error(
        getApiErrorMessage(error, "Thêm ghế thất bại. Vui lòng thử lại."),
      );
    } finally {
      setIsSeatSubmitting(false);
    }
  };

  const handleDeleteSeats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.size === 0) return;

    try {
      setIsDeleteSubmitting(true);
      const ids = Array.from(selectedSeats);
      await cinemaService.deleteSeats({ ids });
      setIsDeleteSeatsModalOpen(false);
      setSelectedSeats(new Set()); // Clear selection
      fetchSeats();
      toast.success(`Đã xóa ${ids.length} ghế thành công!`);
    } catch (error) {
      console.error("Failed to delete seats", error);
      toast.error(
        getApiErrorMessage(error, "Xóa ghế thất bại. Vui lòng thử lại."),
      );
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const handleChangeSeatType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.size === 0) return;

    try {
      setIsChangeTypeSubmitting(true);
      const ids = Array.from(selectedSeats);
      await cinemaService.changeSeatType({ ids, seatType: bulkSeatType });
      setIsChangeTypeModalOpen(false);
      setSelectedSeats(new Set()); // Clear selection
      setBulkSeatType("STANDARD");
      fetchSeats();
      toast.success(`Đã đổi hạng ${ids.length} ghế thành công!`);
    } catch (error) {
      console.error("Failed to change seat type", error);
      toast.error(
        getApiErrorMessage(error, "Đổi hạng ghế thất bại. Vui lòng thử lại."),
      );
    } finally {
      setIsChangeTypeSubmitting(false);
    }
  };

  const handleDeleteAuditorium = async () => {
    if (!auditorium) return;
    try {
      setIsDeleteAuditoriumSubmitting(true);
      await cinemaService.deleteAuditorium(auditorium.id);
      toast.success(`Phòng chiếu "${auditorium.name}" đã được xóa thành công!`);
      setIsDeleteAuditoriumModalOpen(false);
      if (onAuditoriumDeleted) {
        onAuditoriumDeleted(auditorium.id);
      }
    } catch (error) {
      console.error("Failed to delete auditorium", error);
      toast.error(
        getApiErrorMessage(
          error,
          "Xóa phòng chiếu thất bại. Vui lòng thử lại.",
        ),
      );
    } finally {
      setIsDeleteAuditoriumSubmitting(false);
    }
  };

  const handleUpdateAuditorium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditorium) return;
    setEditAuditoriumNameError("");

    if (!editAuditoriumName.trim()) {
      setEditAuditoriumNameError("Vui lòng nhập tên phòng chiếu");
      return;
    }
    if (editAuditoriumName.trim().length < 2) {
      setEditAuditoriumNameError("Tên phòng chiếu phải có ít nhất 2 ký tự");
      return;
    }
    if (editAuditoriumName.trim().length > 50) {
      setEditAuditoriumNameError(
        "Tên phòng chiếu không được vượt quá 50 ký tự",
      );
      return;
    }

    try {
      setIsEditAuditoriumSubmitting(true);
      const updated = await cinemaService.updateAuditorium(auditorium.id, {
        name: editAuditoriumName,
        cinemaId: cinemaId || auditorium.cinema?.id || 0,
        type: editAuditoriumType,
      });
      setIsEditAuditoriumModalOpen(false);
      toast.success(`Phòng chiếu "${editAuditoriumName}" đã được cập nhật!`);
      if (onAuditoriumUpdated) {
        onAuditoriumUpdated(updated);
      }
    } catch (error) {
      console.error("Failed to update auditorium", error);
      toast.error(
        getApiErrorMessage(error, "Cập nhật thất bại. Vui lòng thử lại."),
      );
    } finally {
      setIsEditAuditoriumSubmitting(false);
    }
  };

  const handleSelectRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRowLetters.size === 0) {
      toast.error("Vui lòng chọn ít nhất một hàng.");
      return;
    }

    const next = new Set<number>();
    seatRows.forEach((row) => {
      if (selectedRowLetters.has(row.rowLetter)) {
        row.seats.forEach((seat) => next.add(seat.id));
      }
    });

    setSelectedSeats(next);
    toast.success(`Đã chọn ${next.size} ghế từ các hàng đã chọn.`);
    setIsSelectRowModalOpen(false);
  };

  const getSelectedSeatLabels = () => {
    const labels: string[] = [];
    seatRows.forEach((row) => {
      row.seats.forEach((seat) => {
        if (selectedSeats.has(seat.id)) {
          labels.push(`${seat.rowLetter}${seat.seatNumber}`);
        }
      });
    });
    return labels;
  };

  const toggleSeat = (id: number) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.container}>
      {/* Background Decor */}
      <div className={styles.glowDecor}></div>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            {auditorium ? auditorium.name : "Chọn phòng chiếu"}
          </h3>
          {auditorium && seatRows.length > 0 && (
            <div className={styles.totalSeatsBadge}>
              <span
                className={`material-symbols-outlined ${styles.totalSeatsIcon}`}
              >
                event_seat
              </span>
              <span>
                Tổng số: <strong>{totalSeats}</strong> ghế
              </span>
            </div>
          )}
        </div>

        {auditorium && (
          <div className={styles.headerActions}>
            <button
              className={styles.iconBtn}
              onClick={() => {
                setEditAuditoriumName(auditorium.name);
                setEditAuditoriumType(auditorium.type || "PREMIUM");
                setEditAuditoriumNameError("");
                setIsEditAuditoriumModalOpen(true);
              }}
              title="Cập nhật phòng chiếu"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button
              className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
              onClick={() => setIsDeleteAuditoriumModalOpen(true)}
              title="Xóa phòng chiếu"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className={styles.mapArea}>
        {/* Screen Projection */}
        <div className={styles.screenProjection}>
          <span className={styles.screenLabel}>MÀN CHIẾU PHIM</span>
        </div>

        {/* Seat Grid */}
        <div className={styles.grid}>
          {loading ? (
            <div className={styles.gridPlaceholder}>
              <span className="material-symbols-outlined">sync</span>
              Đang tải sơ đồ ghế...
            </div>
          ) : seatRows.length === 0 ? (
            <div className={styles.gridPlaceholder}>
              <span className="material-symbols-outlined">
                {auditorium ? "event_seat" : "movie"}
              </span>
              {auditorium
                ? "Chưa có hàng ghế nào. Hãy thêm hàng ghế mới!"
                : "Chọn phòng chiếu để xem sơ đồ ghế."}
            </div>
          ) : (
            seatRows.map((row) => (
              <React.Fragment key={row.rowLetter}>
                <div className={styles.rowLabel}>{row.rowLetter}</div>
                <div className={styles.seatRow}>
                  {row.seats.map((seat) => {
                    const label = `${seat.rowLetter}${seat.seatNumber}`;
                    const type = seat.seatType?.toUpperCase();
                    const isSelected = selectedSeats.has(seat.id);

                    let seatClass = styles.seatStandard;
                    if (type === "VIP") seatClass = styles.seatVip;
                    else if (type === "COUPLE") seatClass = styles.seatCouple;

                    return (
                      <div
                        key={seat.id}
                        className={`${styles.seat} ${seatClass} ${isSelected ? styles.seatSelected : ""}`}
                        onClick={() => toggleSeat(seat.id)}
                        title={`Ghế ${label} (${seat.seatType || "Tiêu chuẩn"})`}
                      >
                        <span className={styles.seatNumber}>
                          {seat.seatNumber}
                        </span>
                        {type === "VIP" && (
                          <span
                            className={`material-symbols-outlined ${styles.seatBadge}`}
                          >
                            star
                          </span>
                        )}
                        {type === "COUPLE" && (
                          <span
                            className={`material-symbols-outlined ${styles.seatBadge}`}
                          >
                            favorite
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {isAddRowModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Thêm hàng ghế</h3>
              <form onSubmit={handleAddRow} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Ký hiệu hàng (*)</label>
                  <input
                    type="text"
                    value={newRowLetter}
                    maxLength={2}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/[^a-zA-Z]/g, "")
                        .toUpperCase();
                      setNewRowLetter(val);
                      if (addRowErrors.rowLetter)
                        setAddRowErrors({
                          ...addRowErrors,
                          rowLetter: undefined,
                        });
                    }}
                    disabled={isSubmitting}
                    className={`${styles.input} ${addRowErrors.rowLetter ? styles.inputError : ""}`}
                    placeholder="vd: A"
                  />
                  {addRowErrors.rowLetter && (
                    <div className={styles.fieldError}>
                      {addRowErrors.rowLetter}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Số ghế (*)</label>
                  <input
                    type="number"
                    value={newNumberOfSeats}
                    onChange={(e) => {
                      setNewNumberOfSeats(
                        e.target.value === "" ? "" : Number(e.target.value),
                      );
                      if (addRowErrors.numberOfSeats)
                        setAddRowErrors({
                          ...addRowErrors,
                          numberOfSeats: undefined,
                        });
                    }}
                    disabled={isSubmitting}
                    className={`${styles.input} ${addRowErrors.numberOfSeats ? styles.inputError : ""}`}
                    placeholder="vd: 10"
                  />
                  {addRowErrors.numberOfSeats && (
                    <div className={styles.fieldError}>
                      {addRowErrors.numberOfSeats}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Loại ghế (*)</label>
                  <select
                    value={newSeatType}
                    onChange={(e) => setNewSeatType(e.target.value as SeatType)}
                    required
                    disabled={isSubmitting}
                    className={styles.input}
                  >
                    <option value="STANDARD">Tiêu chuẩn</option>
                    <option value="VIP">VIP</option>
                    <option value="COUPLE">Cặp đôi</option>
                  </select>
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsAddRowModalOpen(false)}
                    disabled={isSubmitting}
                    className={styles.cancelBtn}
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitBtn}
                  >
                    {isSubmitting ? "Đang thêm..." : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {isAddSeatModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Thêm ghế</h3>
              <form onSubmit={handleAddSeat} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Hàng (*)</label>
                  <input
                    type="text"
                    value={seatRowLetter}
                    maxLength={2}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/[^a-zA-Z]/g, "")
                        .toUpperCase();
                      setSeatRowLetter(val);
                      if (addSeatErrors.seatRowLetter)
                        setAddSeatErrors({
                          ...addSeatErrors,
                          seatRowLetter: undefined,
                        });
                    }}
                    disabled={isSeatSubmitting}
                    className={`${styles.input} ${addSeatErrors.seatRowLetter ? styles.inputError : ""}`}
                    placeholder="vd: A"
                  />
                  {addSeatErrors.seatRowLetter && (
                    <div className={styles.fieldError}>
                      {addSeatErrors.seatRowLetter}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Số ghế (*)</label>
                  <input
                    type="number"
                    value={seatNumber}
                    onChange={(e) => {
                      setSeatNumber(
                        e.target.value === "" ? "" : Number(e.target.value),
                      );
                      if (addSeatErrors.seatNumber)
                        setAddSeatErrors({
                          ...addSeatErrors,
                          seatNumber: undefined,
                        });
                    }}
                    disabled={isSeatSubmitting}
                    className={`${styles.input} ${addSeatErrors.seatNumber ? styles.inputError : ""}`}
                    placeholder="vd: 5"
                  />
                  {addSeatErrors.seatNumber && (
                    <div className={styles.fieldError}>
                      {addSeatErrors.seatNumber}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Loại ghế (*)</label>
                  <select
                    value={seatType}
                    onChange={(e) => setSeatType(e.target.value as SeatType)}
                    required
                    disabled={isSeatSubmitting}
                    className={styles.input}
                  >
                    <option value="STANDARD">Tiêu chuẩn</option>
                    <option value="VIP">VIP</option>
                    <option value="COUPLE">Cặp đôi</option>
                  </select>
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsAddSeatModalOpen(false)}
                    disabled={isSeatSubmitting}
                    className={styles.cancelBtn}
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    disabled={isSeatSubmitting}
                    className={styles.submitBtn}
                  >
                    {isSeatSubmitting ? "Đang thêm..." : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {isDeleteSeatsModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Xác nhận xóa ghế</h3>
              <form onSubmit={handleDeleteSeats} className={styles.form}>
                <p
                  style={{
                    color: "var(--color-on-surface-variant)",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                  }}
                >
                  Bạn có chắc chắn muốn xóa{" "}
                  <strong>{selectedSeats.size}</strong> ghế đã chọn không?
                  <br />
                  <br />
                  <span style={{ color: "var(--color-error)" }}>
                    {getSelectedSeatLabels().join(", ")}
                  </span>
                </p>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsDeleteSeatsModalOpen(false)}
                    disabled={isDeleteSubmitting}
                    className={styles.cancelBtn}
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    disabled={isDeleteSubmitting}
                    className={styles.submitBtn}
                    style={{
                      backgroundColor: "var(--color-error)",
                      color: "var(--color-on-error)",
                    }}
                  >
                    {isDeleteSubmitting ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {isChangeTypeModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Đổi hạng ghế</h3>
              <form onSubmit={handleChangeSeatType} className={styles.form}>
                <p
                  style={{
                    color: "var(--color-on-surface-variant)",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    marginBottom: "0.5rem",
                  }}
                >
                  Bạn đang đổi hạng cho <strong>{selectedSeats.size}</strong>{" "}
                  ghế:
                  <br />
                  <span style={{ color: "var(--color-primary-container)" }}>
                    {getSelectedSeatLabels().join(", ")}
                  </span>
                </p>
                <div className={styles.formGroup}>
                  <label>Chọn hạng ghế mới (*)</label>
                  <select
                    value={bulkSeatType}
                    onChange={(e) =>
                      setBulkSeatType(e.target.value as SeatType)
                    }
                    required
                    disabled={isChangeTypeSubmitting}
                    className={styles.input}
                  >
                    <option value="STANDARD">Tiêu chuẩn</option>
                    <option value="VIP">VIP</option>
                    <option value="COUPLE">Cặp đôi</option>
                  </select>
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsChangeTypeModalOpen(false)}
                    disabled={isChangeTypeSubmitting}
                    className={styles.cancelBtn}
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    disabled={isChangeTypeSubmitting}
                    className={styles.submitBtn}
                  >
                    {isChangeTypeSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {isSelectRowModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Chọn hàng ghế</h3>
              <form onSubmit={handleSelectRow} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Chọn các hàng muốn bôi đen (*)</label>
                  <div className={styles.chipGroup}>
                    {seatRows.map((row) => {
                      const isSelected = selectedRowLetters.has(row.rowLetter);
                      return (
                        <div
                          key={row.rowLetter}
                          className={`${styles.chip} ${isSelected ? styles.chipSelected : ""}`}
                          onClick={() => {
                            setSelectedRowLetters((prev) => {
                              const next = new Set(prev);
                              if (next.has(row.rowLetter))
                                next.delete(row.rowLetter);
                              else next.add(row.rowLetter);
                              return next;
                            });
                          }}
                        >
                          Hàng {row.rowLetter}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsSelectRowModalOpen(false)}
                    className={styles.cancelBtn}
                  >
                    Hủy
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Chọn
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {isDeleteAuditoriumModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Xóa phòng chiếu</h3>
              <p
                style={{
                  color: "var(--color-on-surface)",
                  marginBottom: "1.5rem",
                  fontSize: "0.875rem",
                }}
              >
                Bạn có chắc chắn muốn xóa phòng chiếu{" "}
                <strong>{auditorium?.name}</strong> không? Hành động này không
                thể hoàn tác.
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsDeleteAuditoriumModalOpen(false)}
                  disabled={isDeleteAuditoriumSubmitting}
                  className={styles.cancelBtn}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAuditorium}
                  disabled={isDeleteAuditoriumSubmitting}
                  className={styles.submitBtn}
                  style={{ backgroundColor: "#e53935", color: "white" }}
                >
                  {isDeleteAuditoriumSubmitting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {isEditAuditoriumModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Cập nhật phòng chiếu</h3>
              <form onSubmit={handleUpdateAuditorium} className={styles.form}>
                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label>Tên (*)</label>
                    <span
                      className={`${styles.charCount} ${editAuditoriumName.length > 50 ? styles.charCountOver : ""}`}
                    >
                      {50 - editAuditoriumName.length}
                      {"/50"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editAuditoriumName}
                    maxLength={50}
                    onChange={(e) => {
                      setEditAuditoriumName(e.target.value);
                      if (editAuditoriumNameError)
                        setEditAuditoriumNameError("");
                    }}
                    disabled={isEditAuditoriumSubmitting}
                    className={`${styles.input} ${editAuditoriumNameError ? styles.inputError : ""}`}
                    placeholder="vd: Phòng chiếu 1"
                  />
                  {editAuditoriumNameError && (
                    <p className={styles.fieldError}>
                      {editAuditoriumNameError}
                    </p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Loại phòng (*)</label>
                  <select
                    value={editAuditoriumType}
                    onChange={(e) =>
                      setEditAuditoriumType(e.target.value as AuditoriumType)
                    }
                    disabled={isEditAuditoriumSubmitting}
                    className={styles.select}
                  >
                    {AUDITORIUM_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {AUDITORIUM_TYPE_LABELS[t]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditAuditoriumModalOpen(false);
                      setEditAuditoriumNameError("");
                    }}
                    disabled={isEditAuditoriumSubmitting}
                    className={styles.cancelBtn}
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    disabled={isEditAuditoriumSubmitting}
                    className={styles.submitBtn}
                  >
                    {isEditAuditoriumSubmitting ? "Đang lưu..." : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SeatMap;
