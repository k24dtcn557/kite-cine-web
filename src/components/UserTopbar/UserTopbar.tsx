import React from 'react';
import { ThemeToggle } from '../../components';
import styles from './UserTopbar.module.css';

interface UserTopbarProps {
  onMenuClick?: () => void;
}

const UserTopbar: React.FC<UserTopbarProps> = ({ onMenuClick }) => {
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
            placeholder="Search movies, theaters, or transactions..."
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

        {/* Brand */}
        <div className={styles.brandLabel}>
          <span className={styles.brandText}>My Cine</span>
        </div>
      </div>
    </header>
  );
};

export default UserTopbar;
