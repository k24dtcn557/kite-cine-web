import React from "react";
import styles from "./SeatControls.module.css";

interface SeatControlsProps {
  hasAuditorium?: boolean;
  onAddRow?: () => void;
  onAddSeat?: () => void;
  onDeleteSeats?: () => void;
  onChangeSeatType?: () => void;
  onClearSelection?: () => void;
  onSelectRow?: () => void;
}

const SeatControls: React.FC<SeatControlsProps> = ({
  hasAuditorium,
  onAddRow,
  onAddSeat,
  onDeleteSeats,
  onChangeSeatType,
  onClearSelection,
  onSelectRow,
}) => {
  return (
    <>
      <div className={styles.container}>
        <h4 className={styles.title}>QUẢN LÝ GHẾ</h4>
        <div className={styles.actions}>
          <button
            className={styles.addRowBtn}
            onClick={onAddRow}
            disabled={!hasAuditorium}
          >
            <span
              className={`material-symbols-outlined ${styles.controlBtnIcon}`}
            >
              table_rows
            </span>
            Thêm hàng ghế
          </button>
          <div className={styles.btnGroup}>
            <button
              className={styles.controlBtn}
              onClick={onAddSeat}
              disabled={!hasAuditorium}
            >
              <span
                className={`material-symbols-outlined ${styles.controlBtnIcon}`}
              >
                add
              </span>
              Thêm ghế
            </button>
            <button
              className={styles.controlBtn}
              onClick={onDeleteSeats}
              disabled={!hasAuditorium}
            >
              <span
                className={`material-symbols-outlined ${styles.controlBtnIcon}`}
              >
                remove
              </span>
              Xóa ghế
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div>
          <h4 className={styles.title}>TÙY CHỈNH</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <button
              className={`${styles.tierBtn} ${styles.tierBtnPrimary}`}
              onClick={onChangeSeatType}
              disabled={!hasAuditorium}
              style={{ width: "100%" }}
            >
              Đổi hạng ghế
            </button>

            <div className={styles.tierGroup}>
              <button
                className={styles.tierBtn}
                onClick={onSelectRow}
                disabled={!hasAuditorium}
                style={{ flex: 1 }}
              >
                Chọn hàng
              </button>
              <button
                className={styles.tierBtn}
                onClick={onClearSelection}
                disabled={!hasAuditorium}
                style={{ flex: 1 }}
              >
                Bỏ chọn tất cả
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatControls;
