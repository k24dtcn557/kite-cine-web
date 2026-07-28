import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import { getApiErrorMessage } from "../../types/api";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
  onSignUp?: () => void;
  onForgotPassword?: () => void;
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSignUp,
  onForgotPassword,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  /* ── Mouse-tracking spotlight effect ── */
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    setIsSubmitting(true);

    // We can use a toast promise to show loading state
    toast
      .promise(login({ username, password }), {
        loading: "Đang đăng nhập...",
        success: "Chào mừng bạn trở lại!",
        error: (err: any) =>
          getApiErrorMessage(
            err,
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
          ),
      })
      .then(() => {
        setUsername("");
        setPassword("");
        setShowPassword(false);
        if (onLoginSuccess) {
          onLoginSuccess();
          return;
        }
      })
      .catch((error) => {
        // DO NOTHING HERE
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className={styles.card} ref={cardRef}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <h1 className={styles.heading}>Đăng nhập</h1>
        <p className={styles.subheading}>
          Đăng nhập để trải nghiệm những khoảnh khắc đáng nhớ cùng Kite Cine.
        </p>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div className={styles.fieldGroup}>
          <label htmlFor="username" className={styles.label}>
            Tên đăng nhập / Email
          </label>
          <input
            id="username"
            type="text"
            className={styles.input}
            placeholder="Nhập tên đăng nhập hoặc email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            disabled={isSubmitting}
          />
        </div>

        {/* Password */}
        <div className={styles.fieldGroup}>
          <div className={styles.passwordHeader}>
            <label htmlFor="password" className={styles.label}>
              Mật khẩu
            </label>
            <button
              type="button"
              className={styles.forgotLink}
              onClick={onForgotPassword}
              tabIndex={-1}
              disabled={isSubmitting}
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              disabled={isSubmitting}
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : null}
          {isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>

      {/* Sign-up link */}
      <p className={styles.signupText}>
        Chưa có tài khoản?{" "}
        <button
          type="button"
          className={styles.signupLink}
          onClick={onSignUp}
          disabled={isSubmitting}
        >
          Đăng ký
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
