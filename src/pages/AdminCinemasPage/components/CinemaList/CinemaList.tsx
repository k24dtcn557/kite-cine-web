import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import styles from "./CinemaList.module.css";
import { cinemaService } from "../../../../services/cinema.service";
import { getApiErrorMessage } from "../../../../types/api";

interface CinemaListProps {
  selectedCinemaId?: number;
  onSelectCinema?: (id: number) => void;
}

const CinemaList: React.FC<CinemaListProps> = ({
  selectedCinemaId,
  onSelectCinema,
}) => {
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [cinemaToDelete, setCinemaToDelete] = useState<any>(null);
  const [cinemaToEdit, setCinemaToEdit] = useState<any>(null);

  const fetchCinemas = async () => {
    try {
      const result = await cinemaService.getCinemas();
      const data = result;
      setCinemas(data);
    } catch (error) {
      console.error("Failed to fetch cinemas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCinemaToEdit(null);
    setNewName("");
    setNewAddress("");
    setNameError("");
    setAddressError("");
  };

  const handleCreateCinema = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    setAddressError("");

    let hasError = false;

    if (!newName.trim()) {
      setNameError("Vui lòng nhập tên rạp");
      hasError = true;
    } else if (newName.trim().length < 2) {
      setNameError("Tên rạp phải có ít nhất 2 ký tự");
      hasError = true;
    }

    if (!newAddress.trim()) {
      setAddressError("Vui lòng nhập địa chỉ");
      hasError = true;
    } else if (newAddress.trim().length < 5) {
      setAddressError("Địa chỉ phải có ít nhất 5 ký tự");
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsSubmitting(true);
      if (cinemaToEdit) {
        await cinemaService.update(cinemaToEdit.id, {
          name: newName,
          address: newAddress,
        });
        toast.success(`Rạp "${newName}" đã được cập nhật thành công!`);
      } else {
        await cinemaService.create({ name: newName, address: newAddress });
        toast.success(`Rạp "${newName}" đã được tạo thành công!`);
      }
      handleCloseModal();
      fetchCinemas();
    } catch (error) {
      console.error("Failed to save cinema", error);
      toast.error(
        getApiErrorMessage(
          error,
          cinemaToEdit
            ? "Cập nhật rạp thất bại. Vui lòng thử lại."
            : "Tạo rạp thất bại. Vui lòng thử lại.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCinema = async () => {
    if (!cinemaToDelete) return;
    try {
      setIsSubmitting(true);
      await cinemaService.delete(cinemaToDelete.id);
      toast.success(`Rạp "${cinemaToDelete.name}" đã được xóa thành công!`);
      setCinemaToDelete(null);
      fetchCinemas();
    } catch (error) {
      console.error("Failed to delete cinema", error);
      toast.error(
        getApiErrorMessage(error, "Xóa rạp thất bại. Vui lòng thử lại."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Rạp chiếu phim</h3>
        <button
          className={styles.addBtn}
          aria-label="Thêm rạp"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-symbols-outlined">add_circle</span>
        </button>
      </div>

      <div className={`${styles.list} custom-scrollbar`}>
        {loading ? (
          <div className={styles.listPlaceholder}>
            <span className="material-symbols-outlined">sync</span>
            Đang tải danh sách rạp...
          </div>
        ) : cinemas.length === 0 ? (
          <div className={styles.listPlaceholder}>
            <span className="material-symbols-outlined">movie</span>
            Chưa có rạp nào. Hãy thêm rạp mới!
          </div>
        ) : (
          cinemas.map((cinema, index) => (
            <div
              key={cinema.id || index}
              className={
                selectedCinemaId === cinema.id
                  ? styles.cardActive
                  : styles.cardInactive
              }
              onClick={() => onSelectCinema && onSelectCinema(cinema.id)}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{cinema.name}</span>
                <div className={styles.menuContainer}>
                  <span
                    className={`material-symbols-outlined ${styles.moreIcon}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === cinema.id ? null : cinema.id,
                      );
                    }}
                  >
                    more_vert
                  </span>
                  {openMenuId === cinema.id && (
                    <div className={styles.dropdownMenu}>
                      <button
                        className={styles.menuItem}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCinemaToEdit(cinema);
                          setNewName(cinema.name);
                          setNewAddress(cinema.address);
                          setIsModalOpen(true);
                          setOpenMenuId(null);
                        }}
                      >
                        <span
                          className={`material-symbols-outlined ${styles.menuItemIcon}`}
                        >
                          edit
                        </span>
                        Cập nhật
                      </button>
                      <button
                        className={`${styles.menuItem} ${styles.menuItemDelete}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCinemaToDelete(cinema);
                          setOpenMenuId(null);
                        }}
                      >
                        <span
                          className={`material-symbols-outlined ${styles.menuItemIcon}`}
                        >
                          delete
                        </span>
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {cinema.address && (
                <p className={styles.address}>
                  <span
                    className={`material-symbols-outlined ${styles.addressIcon}`}
                  >
                    map
                  </span>
                  {cinema.address}
                </p>
              )}

              <div className={styles.tags}>
                <span className={styles.tagScreen}>
                  {cinema.numberOfAuditoriums} Phòng chiếu
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>{cinemaToEdit ? "Cập nhật rạp" : "Tạo rạp mới"}</h3>
              <form onSubmit={handleCreateCinema} className={styles.form}>
                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label>Tên rạp (*)</label>
                    <span
                      className={`${styles.charCount} ${newName.length >= 80 ? styles.charCountOver : ""}`}
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
                    placeholder="vd: Rạp Thăng Long"
                  />
                  {nameError && (
                    <p className={styles.fieldError}>{nameError}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label>Địa chỉ (*)</label>
                    <span
                      className={`${styles.charCount} ${newAddress.length >= 180 ? styles.charCountOver : ""}`}
                    >
                      {newAddress.length}/200
                    </span>
                  </div>
                  <input
                    type="text"
                    value={newAddress}
                    maxLength={200}
                    onChange={(e) => {
                      setNewAddress(e.target.value);
                      if (addressError) setAddressError("");
                    }}
                    disabled={isSubmitting}
                    className={`${styles.input} ${addressError ? styles.inputError : ""}`}
                    placeholder="vd: Tầng 3, VinCom Nguyễn Chí Thanh"
                  />
                  {addressError && (
                    <p className={styles.fieldError}>{addressError}</p>
                  )}
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
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
                    {isSubmitting
                      ? "Đang lưu..."
                      : cinemaToEdit
                        ? "Cập nhật"
                        : "Tạo"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {cinemaToDelete &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Xóa rạp</h3>
              <p
                style={{
                  color: "var(--color-on-surface)",
                  marginBottom: "1.5rem",
                  fontSize: "0.875rem",
                }}
              >
                Bạn có chắc chắn muốn xóa rạp{" "}
                <strong>{cinemaToDelete.name}</strong> không? Hành động này
                không thể hoàn tác.
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setCinemaToDelete(null)}
                  disabled={isSubmitting}
                  className={styles.cancelBtn}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCinema}
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                  style={{ backgroundColor: "#e53935", color: "white" }}
                >
                  {isSubmitting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default CinemaList;
