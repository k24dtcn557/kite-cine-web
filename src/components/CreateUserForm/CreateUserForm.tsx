import React, { useState } from "react";
import styles from "./CreateUserForm.module.css";
import { CreateUserPayload } from "../../api/management.service";

interface CreateUserFormProps {
  onSubmit: (data: CreateUserPayload) => Promise<void>;
  isUpdating: boolean;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  onSubmit,
  isUpdating,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("USER");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    }

    if (!password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải từ 6 ký tự";
    }

    if (!fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (phone.trim() && !/^\+?[0-9\s\-\(\)]{7,15}$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({
      username,
      password,
      fullName,
      email,
      phoneNumber: phone,
      role,
    });
  };

  return (
    <section className={styles.glassPanel}>
      <div className={styles.decorativeGlow}></div>

      <div className={styles.profileForm}>
        <div className={styles.formFields}>
          {/* Role */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Vai trò *</label>
            <select
              className={styles.glassInput}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isUpdating}
            >
              <option value="USER">Người dùng (USER)</option>
              <option value="ADMIN">Quản trị viên (ADMIN)</option>
            </select>
          </div>

          {/* Full Name */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Họ và tên *</label>
            <input
              type="text"
              className={styles.glassInput}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên"
              disabled={isUpdating}
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

          {/* Username */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Tên đăng nhập *</label>
            <input
              type="text"
              className={styles.glassInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              disabled={isUpdating}
            />
            {errors.username && (
              <span
                style={{
                  color: "var(--color-error)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.username}
              </span>
            )}
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Mật khẩu *</label>
            <input
              type="password"
              className={styles.glassInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              disabled={isUpdating}
            />
            {errors.password && (
              <span
                style={{
                  color: "var(--color-error)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.password}
              </span>
            )}
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Email</label>
            <input
              type="email"
              className={styles.glassInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email"
              disabled={isUpdating}
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

          {/* Phone */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Số điện thoại</label>
            <input
              type="tel"
              className={styles.glassInput}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
              disabled={isUpdating}
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
          {isUpdating ? "Đang tạo..." : "Tạo người dùng"}
        </button>
      </div>
    </section>
  );
};

export default CreateUserForm;
