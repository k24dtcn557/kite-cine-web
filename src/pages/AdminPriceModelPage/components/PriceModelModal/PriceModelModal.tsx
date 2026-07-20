import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./PriceModelModal.module.css";
import { SeatType } from "../../../../api/cinema.service";
import {
  priceModelService,
  PriceModelDto,
  PRICE_MODEL_SEAT_TYPES,
} from "../../../../api/price-model.service";
import toast from "react-hot-toast";
import { CommonUtils } from "../../../../utils/CommonUtils";

interface PriceModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: PriceModelDto;
}

const PriceModelModal: React.FC<PriceModelModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [prices, setPrices] = useState<Record<string, number>>({
    STANDARD: 0,
    VIP: 0,
    COUPLE: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setPrices({
          STANDARD: initialData.prices["STANDARD"] || 0,
          VIP: initialData.prices["VIP"] || 0,
          COUPLE: initialData.prices["COUPLE"] || 0,
        });
      } else {
        setName("");
        setPrices({ STANDARD: 0, VIP: 0, COUPLE: 0 });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handlePriceChange = (type: SeatType, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const parsed = parseInt(numericValue, 10);
    setPrices((prev) => ({
      ...prev,
      [type]: isNaN(parsed) ? 0 : parsed,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên bảng giá");
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData) {
        await priceModelService.updatePriceModel(initialData.id, {
          name,
          prices,
        });
        toast.success("Cập nhật bảng giá thành công!");
      } else {
        await priceModelService.createPriceModel({
          name,
          prices,
        });
        toast.success("Tạo bảng giá thành công!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Lỗi khi lưu bảng giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>
          {initialData ? "Cập Nhật Bảng Giá" : "Tạo Bảng Giá Mới"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="priceModelName">Tên bảng giá</label>
            <input
              id="priceModelName"
              type="text"
              className={styles.inputField}
              placeholder="VD: Tiêu chuẩn Ngày thường..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.seatPricesGrid}>
            <label
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "var(--color-on-surface-variant)",
              }}
            >
              Cấu hình Giá ghế
            </label>
            {PRICE_MODEL_SEAT_TYPES.map(({ type, label }) => (
              <div key={type} className={styles.seatPriceRow}>
                <span className={styles.seatLabel}>{label}</span>
                <div className={styles.priceInputWrapper}>
                  <input
                    type="text"
                    className={styles.priceInput}
                    value={
                      prices[type] === 0
                        ? ""
                        : CommonUtils.formatNumberVietnamese(prices[type])
                    }
                    onChange={(e) => handlePriceChange(type, e.target.value)}
                    disabled={isSubmitting}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Đang xử lý..."
                : initialData
                  ? "Lưu thay đổi"
                  : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default PriceModelModal;
