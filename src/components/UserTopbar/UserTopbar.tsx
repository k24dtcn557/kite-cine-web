import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../components";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";
import { UserDto } from "../../types/user";
import styles from "./UserTopbar.module.css";

interface UserTopbarProps {
  onMenuClick?: () => void;
}

const UserTopbar: React.FC<UserTopbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [userInfo, setUserInfo] = useState<UserDto | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
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
    } else {
      setUserInfo(null);
    }
  }, [isAuthenticated]);

  const isAdmin =
    userInfo?.roles?.some(
      (role: any) => (typeof role === "string" ? role : role.name) === "ADMIN",
    ) || false;

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

        {/* Profile */}
        <div className={styles.userInfoWrapper} ref={dropdownRef}>
          <div
            className={styles.userInfo}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {userInfo?.avatar ? (
              <img
                src={userInfo.avatar}
                alt="Avatar"
                className={styles.profileAvatar}
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid var(--color-outline-variant)",
                }}
              />
            ) : (
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "2rem",
                  color: "var(--color-primary)",
                }}
              >
                account_circle
              </span>
            )}
            <div className={styles.profileInfo}>
              <p className={styles.profileName}>
                {userInfo?.fullName || "User"}
              </p>
              <p className={styles.profileRole}>
                {isAdmin ? "Admin" : "Thành viên"}
              </p>
            </div>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "20px",
                color: "var(--color-on-surface-variant)",
                marginLeft: "0.25rem",
              }}
            >
              expand_more
            </span>
          </div>

          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/my-cine/tickets");
                }}
              >
                <span className="material-symbols-outlined">
                  confirmation_number
                </span>
                Vé của tôi
              </button>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/my-cine/profile");
                }}
              >
                <span className="material-symbols-outlined">person</span>
                Hồ sơ cá nhân
              </button>

              <button
                className={`${styles.dropdownItem} ${styles.logout}`}
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
              >
                <span className="material-symbols-outlined">logout</span>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserTopbar;
