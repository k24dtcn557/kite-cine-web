import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../components";
import styles from "./AdminTopbar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { authService, UserDto } from "../../api/auth.service";

interface AdminTopbarProps {
  onMenuClick?: () => void;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserDto | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      authService
        .getMyInfo()
        .then((user) => setUserInfo(user))
        .catch((err) => console.error("Failed to fetch user info", err));
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      {/* Mobile Menu Button */}
      <button
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Actions */}
      <div className={styles.actions}>
        {/* Theme Toggle */}
        <ThemeToggle />

        <div className={styles.divider}></div>

        {/* Profile Widget */}
        <div className={styles.profileWidgetWrapper} ref={menuRef}>
          <div
            className={styles.profileWidget}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {userInfo?.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.fullName}
                className={styles.profileImage}
              />
            ) : (
              <div
                className={styles.profileImage}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--color-surface-container-highest)",
                  color: "var(--color-on-surface)",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1.5rem" }}
                >
                  account_circle
                </span>
              </div>
            )}
            <div className={styles.profileInfo}>
              <p className={styles.profileName}>{userInfo?.fullName}</p>
              <p className={styles.profileRole}>Quản trị</p>
            </div>
            <span
              className="material-symbols-outlined"
              style={{
                color: "var(--color-on-surface-variant)",
                fontSize: "1.25rem",
                marginLeft: "0.25rem",
              }}
            >
              expand_more
            </span>
          </div>

          {isMenuOpen && (
            <div className={styles.profileMenu}>
              <button
                className={styles.menuItem}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/admin");
                }}
              >
                <span
                  className={`material-symbols-outlined ${styles.menuItemIcon}`}
                >
                  dashboard
                </span>
                Tổng quan
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/admin/theaters");
                }}
              >
                <span
                  className={`material-symbols-outlined ${styles.menuItemIcon}`}
                >
                  movie
                </span>
                Rạp chiếu
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/admin/profile");
                }}
              >
                <span
                  className={`material-symbols-outlined ${styles.menuItemIcon}`}
                >
                  person
                </span>
                Hồ sơ cá nhân
              </button>
              <button className={styles.menuItem} onClick={handleLogout}>
                <span
                  className={`material-symbols-outlined ${styles.menuItemIcon}`}
                >
                  logout
                </span>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
