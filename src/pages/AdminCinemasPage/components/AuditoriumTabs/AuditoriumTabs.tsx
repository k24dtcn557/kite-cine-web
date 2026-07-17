import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import styles from "./AuditoriumTabs.module.css";
import {
  cinemaService,
  AuditoriumDto,
  AuditoriumType,
  AUDITORIUM_TYPE_LABELS,
} from "../../../../api/cinema.service";
import { getApiErrorMessage } from "../../../../api/types";

interface AuditoriumTabsProps {
  cinemaId?: number;
  selectedAuditorium?: AuditoriumDto;
  onSelectAuditorium: (auditorium?: AuditoriumDto) => void;
}

const AuditoriumTabs: React.FC<AuditoriumTabsProps> = ({
  cinemaId,
  selectedAuditorium,
  onSelectAuditorium,
}) => {
  const [auditoriums, setAuditoriums] = useState<AuditoriumDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<AuditoriumType>("PREMIUM");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const AUDITORIUM_TYPES = Object.keys(
    AUDITORIUM_TYPE_LABELS,
  ) as AuditoriumType[];

  const fetchAuditoriums = useCallback(async () => {
    if (!cinemaId) {
      setAuditoriums([]);
      return;
    }
    try {
      setLoading(true);
      const result = await cinemaService.searchAuditoriums({
        cinemaId,
        page: 0,
        size: 99999,
      });
      const data = Array.isArray(result) ? result : result?.data || [];
      setAuditoriums(data);
      if (data.length > 0 && !selectedAuditorium) {
        onSelectAuditorium(data[0]);
      } else if (data.length === 0) {
        onSelectAuditorium(undefined);
      }
    } catch (error) {
      console.error("Failed to fetch auditoriums", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinemaId]);

  useEffect(() => {
    fetchAuditoriums();
  }, [fetchAuditoriums]);

  const handleCreateAuditorium = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");

    if (!newName.trim()) {
      setNameError("Vui lòng nhập tên phòng chiếu");
      return;
    }
    if (newName.trim().length < 2) {
      setNameError("Tên phòng chiếu phải có ít nhất 2 ký tự");
      return;
    }
    if (newName.trim().length > 50) {
      setNameError("Tên phòng chiếu không được vượt quá 50 ký tự");
      return;
    }
    if (!cinemaId) return;

    try {
      setIsSubmitting(true);
      await cinemaService.createAuditorium({
        name: newName,
        cinemaId,
        type: newType,
      });
      setIsModalOpen(false);
      setNewName("");
      setNewType("PREMIUM");
      fetchAuditoriums();
      toast.success(`Phòng chiếu "${newName}" đã được tạo thành công!`);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Tạo phòng chiếu thất bại. Vui lòng thử lại.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.placeholder}>
          <span
            className={`material-symbols-outlined ${styles.placeholderIcon}`}
          >
            sync
          </span>
          Đang tải phòng chiếu...
        </div>
      ) : !cinemaId ? (
        <div className={styles.placeholder}>
          <span
            className={`material-symbols-outlined ${styles.placeholderIcon}`}
          >
            movie
          </span>
          Chọn rạp để xem phòng chiếu
        </div>
      ) : auditoriums.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
            meeting_room
          </span>
          <div className={styles.emptyText}>
            <p className={styles.emptyTitle}>Chưa có phòng chiếu</p>
            <p className={styles.emptySubtitle}>
              Nhấn "Thêm phòng chiếu" để bắt đầu
            </p>
          </div>
        </div>
      ) : (
        auditoriums.map((auditorium) => (
          <button
            key={auditorium.id}
            className={
              selectedAuditorium?.id === auditorium.id
                ? styles.tabBtnActive
                : styles.tabBtn
            }
            onClick={() => onSelectAuditorium(auditorium)}
          >
            <span
              className={`material-symbols-outlined ${selectedAuditorium?.id === auditorium.id ? styles.iconActive : styles.icon}`}
            >
              meeting_room
            </span>
            <div>
              <p
                className={`${styles.label} ${selectedAuditorium?.id === auditorium.id ? styles.labelActive : ""}`}
              >
                {auditorium.name}
              </p>
              <p className={styles.subLabel}>
                {auditorium.type
                  ? AUDITORIUM_TYPE_LABELS[auditorium.type]
                  : AUDITORIUM_TYPE_LABELS[AUDITORIUM_TYPES[0]]}
              </p>
            </div>
          </button>
        ))
      )}

      {cinemaId && (
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <span className={`material-symbols-outlined ${styles.addIcon}`}>
            add
          </span>
          <span className={styles.addText}>Thêm phòng chiếu</span>
        </button>
      )}
      {isModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Tạo phòng chiếu mới</h3>
              <form onSubmit={handleCreateAuditorium} className={styles.form}>
                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label>Tên (*)</label>
                    <span
                      className={`${styles.charCount} ${newName.length > 50 ? styles.charCountOver : ""}`}
                    >
                      {newName.length}/50
                    </span>
                  </div>
                  <input
                    type="text"
                    value={newName}
                    maxLength={50}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    disabled={isSubmitting}
                    className={`${styles.input} ${nameError ? styles.inputError : ""}`}
                    placeholder="vd: Phòng chiếu 1"
                  />
                  {nameError && (
                    <p className={styles.fieldError}>{nameError}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Loại phòng (*)</label>
                  <select
                    value={newType}
                    onChange={(e) =>
                      setNewType(e.target.value as AuditoriumType)
                    }
                    disabled={isSubmitting}
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
                      setIsModalOpen(false);
                      setNameError("");
                    }}
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
                    {isSubmitting ? "Đang tạo..." : "Tạo"}
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

export default AuditoriumTabs;
