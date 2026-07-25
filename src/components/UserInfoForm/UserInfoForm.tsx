import React, { useState, useEffect, useRef } from "react";
import styles from "./UserInfoForm.module.css";
import { UserDto, UpdateMyInfoPayload } from "../../types/user";
import { mediaService } from "../../services/media.service";
import { authService } from "../../services/auth.service";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../types/api";

interface UserInfoFormProps {
  initialData: UserDto | null;
  onSubmit: (data: UpdateMyInfoPayload) => Promise<void>;
  onAvatarUpdated?: () => void;
  isUpdating: boolean;
  submitLabel?: string;
}

const formatDOB = (value: string) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 8);
  if (cleaned.length === 0) return "";
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
};

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  initialData,
  onSubmit,
  onAvatarUpdated,
  isUpdating,
  submitLabel = "Cập nhật hồ sơ",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName || "");
      setPhone(initialData.phoneNumber || "");
      setEmail(initialData.email || "");
      let initialDob = "";
      if (initialData.dob) {
        const datePart = initialData.dob.split("T")[0];
        const parts = datePart.split("-");
        if (parts.length === 3) {
          initialDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
        } else {
          initialDob = initialData.dob;
        }
      }
      setDob(initialDob);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (phone && !/^\+?[0-9\s\-\(\)]{7,15}$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    let parsedDob: string | undefined = undefined;
    if (dob) {
      if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dob)) {
        newErrors.dob = "Ngày sinh phải theo định dạng dd/mm/yyyy";
      } else {
        const parts = dob.split("/");
        parsedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({
      fullName,
      email: email,
      phoneNumber: phone,
      dob: parsedDob,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateAvatar = async () => {
    if (!selectedFile) return;
    setIsUploadingAvatar(true);
    try {
      const uploadRes = await mediaService.uploadMedia(selectedFile);
      await authService.updateAvatar(uploadRes.uri);
      toast.success("Cập nhật ảnh đại diện thành công!");
      setSelectedFile(null);
      setPreviewUrl(null);
      if (onAvatarUpdated) {
        onAvatarUpdated();
      }
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessage(error, "Cập nhật ảnh đại diện thất bại."));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <section className={styles.glassPanel}>
      <div className={styles.decorativeGlow}></div>
      <div className={styles.sectionHeader}>
        <span className={`material-symbols-outlined ${styles.headerIcon}`}>
          person
        </span>
        <h3 className={styles.sectionTitle}>Thông tin hồ sơ</h3>
      </div>

      <div className={styles.profileForm}>
        {/* Avatar Upload */}
        <div className={styles.avatarSection}>
          <div
            className={styles.avatarWrapper}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl || initialData?.avatar ? (
              <img
                src={previewUrl || initialData?.avatar}
                alt="Avatar"
                className={styles.avatarImage}
              />
            ) : (
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "6rem",
                  color: "var(--color-primary)",
                  backgroundColor: "var(--color-surface-container-high)",
                }}
              >
                account_circle
              </span>
            )}
            <div className={styles.avatarOverlay}>
              <span className="material-symbols-outlined text-white">
                photo_camera
              </span>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {!selectedFile ? (
            <button
              className={styles.btnUpload}
              onClick={() => fileInputRef.current?.click()}
            >
              Tải ảnh lên
            </button>
          ) : (
            <button
              className={styles.btnPrimary}
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
              onClick={handleUpdateAvatar}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? "Đang tải lên..." : "Cập nhật Avatar"}
            </button>
          )}
        </div>

        {/* Inputs */}
        <div className={styles.formFields}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Họ và tên</label>
            <input
              className={styles.glassInput}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && (
              <span
                style={{
                  color: "var(--color-error)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.fullName}
              </span>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Địa chỉ Email</label>
            <input
              className={styles.glassInput}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span
                style={{
                  color: "var(--color-error)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.email}
              </span>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Số điện thoại</label>
            <input
              className={styles.glassInput}
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && (
              <span
                style={{
                  color: "var(--color-error)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.phone}
              </span>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Ngày sinh</label>
            <input
              className={styles.glassInput}
              type="text"
              placeholder="dd/mm/yyyy"
              value={dob}
              onChange={(e) => setDob(formatDOB(e.target.value))}
            />
            {errors.dob && (
              <span
                style={{
                  color: "var(--color-error)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.dob}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.actionRow}>
        <button
          className={styles.btnPrimary}
          onClick={handleSubmit}
          disabled={isUpdating}
        >
          <span
            className={`material-symbols-outlined ${isUpdating ? styles.spinner : ""}`}
            style={{ fontSize: "20px" }}
          >
            {isUpdating ? "progress_activity" : "save"}
          </span>
          {isUpdating ? "Đang cập nhật..." : submitLabel}
        </button>
      </div>
    </section>
  );
};

export default UserInfoForm;
