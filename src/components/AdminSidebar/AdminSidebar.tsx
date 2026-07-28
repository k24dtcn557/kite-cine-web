import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AdminSidebar.module.css";

const NAV_ITEMS = [
  { label: "Báo cáo nhanh", icon: "dashboard", path: "/admin" },
  { label: "Rạp chiếu", icon: "theater_comedy", path: "/admin/cinemas" },
  { label: "Bảng giá", icon: "request_quote", path: "/admin/price-models" },
  { label: "Phim", icon: "movie", path: "/admin/movies" },
  { label: "Quản lý vé", icon: "confirmation_number", path: "/admin/bookings" },
  { label: "Người dùng", icon: "group", path: "/admin/users" },
  { label: "Hồ sơ cá nhân", icon: "person", path: "/admin/profile" },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
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
            <p className={styles.brandSubtitle}>Quản trị</p>
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

export default AdminSidebar;
