import React, { useState, useEffect } from "react";
import styles from "./UserProfilePage.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";
import { UserDto } from "../../types/user";
import { getApiErrorMessage } from "../../types/api";
import toast from "react-hot-toast";
import UserInfoForm from "../../components/UserInfoForm";

const UserProfilePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [userInfo, setUserInfo] = useState<UserDto | null>(null);

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

  const fetchUserInfo = () => {
    authService
      .getMyInfo()
      .then((user) => {
        setUserInfo(user);
      })
      .catch((err) => console.error("Failed to fetch user info", err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  const handleUpdateProfile = async (payload: any) => {
    setIsUpdating(true);
    try {
      const updatedUser = await authService.updateMyInfo(payload);
      setUserInfo(updatedUser);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      console.error("Update failed", error);
      toast.error(
        getApiErrorMessage(error, "Cập nhật thất bại. Vui lòng thử lại."),
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
          <UserInfoForm
            initialData={userInfo}
            onSubmit={handleUpdateProfile}
            onAvatarUpdated={fetchUserInfo}
            isUpdating={isUpdating}
          />
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
