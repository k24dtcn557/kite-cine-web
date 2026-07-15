import React from 'react';
import { ThemeToggle } from '../../components';
import styles from './AdminTopbar.module.css';

interface AdminTopbarProps {
  onMenuClick?: () => void;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuClick }) => {
  return (
    <header className={styles.header}>
      {/* Mobile Menu Button */}
      <button className={styles.menuButton} onClick={onMenuClick} aria-label="Open menu">
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Search */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search cinemas, movies, or transactions..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className={styles.iconWrapper}>
          <span className="material-symbols-outlined">notifications</span>
          <span className={styles.notificationDot}></span>
        </div>

        {/* Help */}
        <span className={`material-symbols-outlined ${styles.iconWrapper}`}>help</span>

        <div className={styles.divider}></div>

        {/* Profile Widget */}
        <div className={styles.profileWidget}>
          <img
            src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
            alt="Admin Avatar"
            className={styles.profileImage}
          />
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>Admin Profile</p>
            <p className={styles.profileRole}>Executive Access</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
