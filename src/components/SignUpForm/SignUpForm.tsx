import React, { useEffect, useRef, useState } from "react";
import styles from "./SignUpForm.module.css";
import toast from "react-hot-toast";
import { authService } from "../../services/auth.service";
import { RegisterPayload } from "../../types/user";

interface SignUpFormProps {
  onLogIn?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onLogIn }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});
  const cardRef = useRef<HTMLDivElement>(null);

  /* ── Mouse-tracking spotlight ── */
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };
    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Vui lòng nhập email hợp lệ.";
    if (password.length < 8)
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const payload: RegisterPayload = {
      username: email,
      password: password,
      fullName: fullName,
    };

    try {
      await authService.register(payload);
      toast.success(
        "Đăng ký thành công! Bạn có thể đăng nhập để bắt đầu hành trình điện ảnh của mình.",
      );
      if (onLogIn) onLogIn();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.card} ref={cardRef}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <h1 className={styles.heading}>Đăng ký</h1>
        <p className={styles.subheading}>
          Trải nghiệm điện ảnh không giới hạn.
        </p>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className={styles.fieldGroup}>
          <label htmlFor="fullName" className={styles.label}>
            Họ và Tên
          </label>
          <input
            id="fullName"
            type="text"
            className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setErrors((p) => ({ ...p, fullName: undefined }));
            }}
            autoComplete="name"
          />
          {errors.fullName && (
            <span className={styles.errorMsg}>{errors.fullName}</span>
          )}
        </div>

        {/* Email */}
        <div className={styles.fieldGroup}>
          <label htmlFor="signupEmail" className={styles.label}>
            Địa chỉ Email
          </label>
          <input
            id="signupEmail"
            type="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: undefined }));
            }}
            autoComplete="email"
          />
          {errors.email && (
            <span className={styles.errorMsg}>{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className={styles.fieldGroup}>
          <label htmlFor="signupPassword" className={styles.label}>
            Mật khẩu
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="signupPassword"
              type={showPassword ? "text" : "password"}
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              placeholder="Tối thiểu 8 ký tự"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: undefined }));
              }}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {errors.password && (
            <span className={styles.errorMsg}>{errors.password}</span>
          )}
        </div>
        {/* Submit */}
        <button
          type="submit"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span className={styles.spinner} aria-hidden="true" />
          )}
          {isSubmitting ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
        </button>
      </form>

      {/* Log in link */}
      <p className={styles.loginText}>
        Đã có tài khoản?{" "}
        <button type="button" className={styles.loginLink} onClick={onLogIn}>
          Đăng nhập
        </button>
      </p>
    </div>
  );
};

export default SignUpForm;
