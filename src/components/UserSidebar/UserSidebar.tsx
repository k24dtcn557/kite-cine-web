import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './UserSidebar.module.css';

interface UserSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { label: 'Overview', icon: 'dashboard', path: '/my-cine' },
  { label: 'My Tickets', icon: 'confirmation_number', path: '/my-cine/tickets' },
  { label: 'Watchlist', icon: 'bookmark', path: '/my-cine/watchlist' },
  { label: 'History', icon: 'history', path: '/my-cine/history' },
  { label: 'Rewards', icon: 'redeem', path: '/my-cine/rewards' },
  { label: 'Settings', icon: 'settings', path: '/my-cine/settings' },
];

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        {/* Brand */}
        <div className={styles.brandContainer}>
          <h1 className={styles.brandTitle}>CINEPLEX</h1>
          <p className={styles.brandSubtitle}>Member Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <span className={`material-symbols-outlined ${styles.navIcon}`}>
                  {item.icon}
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Block */}
        <div className={styles.profileBlock}>
          <div className={styles.profileInner}>
            <span 
              className={`material-symbols-outlined ${styles.profileAvatar}`}
            >
              account_circle
            </span>
            <div className={styles.profileInfo}>
              <p className={styles.profileName}>Alex Rivera</p>
              <p className={styles.profileRole}>Gold Member</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
