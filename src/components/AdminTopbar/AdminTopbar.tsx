import React, { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "../../components";
import styles from "./AdminTopbar.module.css";

interface AdminTopbarProps {
  onMenuClick?: () => void;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <img
              src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
              alt="Admin Avatar"
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <p className={styles.profileName}>Admin Profile</p>
              <p className={styles.profileRole}>Executive Access</p>
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
              <button className={styles.menuItem}>
                <span
                  className={`material-symbols-outlined ${styles.menuItemIcon}`}
                >
                  person
                </span>
                Hồ sơ
              </button>
              <button className={styles.menuItem}>
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
