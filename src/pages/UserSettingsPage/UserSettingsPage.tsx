import React, { useState, useEffect } from "react";
import styles from "./UserSettingsPage.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { authService, UserDto } from "../../api/auth.service";

const UserSettingsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [userInfo, setUserInfo] = useState<UserDto | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+84 (555) 123-4567");

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState("vi");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      authService
        .getMyInfo()
        .then((user) => {
          setUserInfo(user);
          setFullName(user.fullName || "");
          setEmail(user.email || "");
          // Phone is not in UserDto by default, leaving the mock value
        })
        .catch((err) => console.error("Failed to fetch user info", err));
    }
  }, [isAuthenticated]);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Cài đặt tài khoản</h2>
        <p className={styles.pageSubtitle}>Quản lý hồ sơ và bảo mật</p>
      </header>

      <div className={styles.gridContainer}>
        {/* Main Column */}
        <div className={styles.mainColumn}>
          {/* Profile Section */}
          <section className={styles.glassPanel}>
            <div className={styles.decorativeGlow}></div>
            <div className={styles.sectionHeader}>
              <span
                className={`material-symbols-outlined ${styles.headerIcon}`}
              >
                person
              </span>
              <h3 className={styles.sectionTitle}>Thông tin hồ sơ</h3>
            </div>

            <div className={styles.profileForm}>
              {/* Avatar Upload */}
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  {userInfo?.avatar ? (
                    <img
                      src={userInfo.avatar}
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
                <button className={styles.btnUpload}>Tải ảnh lên</button>
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
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Địa chỉ Email</label>
                  <input
                    className={styles.glassInput}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Số điện thoại</label>
                  <input
                    className={styles.glassInput}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.actionRow}>
              <button className={styles.btnPrimary}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  save
                </span>
                Cập nhật hồ sơ
              </button>
            </div>
          </section>
        </div>

        {/* Side Column - Security */}
        <div className={styles.sideColumn}>
          <section
            className={styles.glassPanel}
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div className={styles.sectionHeader}>
              <span
                className={`material-symbols-outlined ${styles.headerIcon}`}
              >
                lock
              </span>
              <h3 className={styles.sectionTitle}>Bảo mật</h3>
            </div>

            <div className={styles.securityForm}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Mật khẩu hiện tại</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    className={styles.glassInput}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.btnTogglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              <div className={`${styles.inputGroup} ${styles.mtTop}`}>
                <label className={styles.inputLabel}>Mật khẩu mới</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    className={styles.glassInput}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Xác nhận mật khẩu mới
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    className={styles.glassInput}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.mtTop}>
              <button className={styles.btnSecondary} style={{ width: "100%" }}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  key
                </span>
                Đổi mật khẩu
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
