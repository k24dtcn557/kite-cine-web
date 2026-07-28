import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./UserSidebar.module.css";

interface UserSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  {
    label: "Vé của tôi",
    icon: "confirmation_number",
    path: "/my-cine/tickets",
  },
  { label: "Hồ sơ", icon: "person", path: "/my-cine/profile" },
];

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        {/* Brand */}
        <Link to="/" style={{ textDecoration: "none" }} onClick={onClose}>
          <div className={styles.brandContainer}>
            <h1 className={styles.brandTitle}>KITE CINE</h1>
            <p className={styles.brandSubtitle}>Thành viên</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={onClose}
              >
                <span className={`material-symbols-outlined ${styles.navIcon}`}>
                  {item.icon}
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default UserSidebar;
