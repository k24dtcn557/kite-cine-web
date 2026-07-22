import React, { useState, useEffect } from "react";
import styles from "./UserProfilePage.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { authService, UserDto } from "../../api/auth.service";
import { getApiErrorMessage } from "../../api/types";
import toast from "react-hot-toast";

const formatDOB = (value: string) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 8);
  if (cleaned.length === 0) return "";
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
};

const UserProfilePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [userInfo, setUserInfo] = useState<UserDto | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      authService
        .getMyInfo()
        .then((user) => {
          setUserInfo(user);
          setFullName(user.fullName || "");
          setPhone(user.phoneNumber || "");
          setEmail(user.email || "");
          let initialDob = "";
          if (user.dob) {
            const datePart = user.dob.split("T")[0];
            const parts = datePart.split("-");
            if (parts.length === 3) {
              initialDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
            } else {
              initialDob = user.dob;
            }
          }
          setDob(initialDob);
        })
        .catch((err) => console.error("Failed to fetch user info", err));
    }
  }, [isAuthenticated]);

  const handleUpdateProfile = async () => {
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

    setIsUpdating(true);
    try {
      const updatedUser = await authService.updateMyInfo({
        fullName,
        email: email,
        phoneNumber: phone,
        dob: parsedDob,
      });
      setUserInfo(updatedUser);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      console.error("Update failed", error);
      toast.error(
        getApiErrorMessage(error, "Cập nhật thất bại. V vui lòng thử lại."),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordErrors({});
    const newErrors: { [key: string]: string } = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Mật khẩu hiện tại là bắt buộc";
    }

    if (!newPassword || newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Change password failed", error);
      toast.error(
        getApiErrorMessage(error, "Đổi mật khẩu thất bại. Vui lòng thử lại."),
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Hồ sơ của tôi</h2>
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
                onClick={handleUpdateProfile}
                disabled={isUpdating}
              >
                <span
                  className={`material-symbols-outlined ${isUpdating ? styles.spinner : ""}`}
                  style={{ fontSize: "20px" }}
                >
                  {isUpdating ? "progress_activity" : "save"}
                </span>
                {isUpdating ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
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
                    tabIndex={-1}
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
                {passwordErrors.currentPassword && (
                  <span
                    style={{
                      color: "var(--color-error)",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {passwordErrors.currentPassword}
                  </span>
                )}
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
                {passwordErrors.newPassword && (
                  <span
                    style={{
                      color: "var(--color-error)",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {passwordErrors.newPassword}
                  </span>
                )}
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
                {passwordErrors.confirmPassword && (
                  <span
                    style={{
                      color: "var(--color-error)",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {passwordErrors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.mtTop}>
              <button
                className={styles.btnSecondary}
                style={{ width: "100%" }}
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                <span
                  className={`material-symbols-outlined ${isChangingPassword ? styles.spinner : ""}`}
                  style={{ fontSize: "20px" }}
                >
                  {isChangingPassword ? "progress_activity" : "key"}
                </span>
                {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
