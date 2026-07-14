import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './AdminSidebar.module.css';

const NAV_ITEMS = [
  { label: 'Overview', icon: 'dashboard', path: '/admin' },
  { label: 'Cinemas', icon: 'theater_comedy', path: '/admin/cinemas' },
  { label: 'Movies', icon: 'movie', path: '/admin/movies' },
  { label: 'Bookings', icon: 'confirmation_number', path: '/admin/bookings' },
  { label: 'Analytics', icon: 'insights', path: '/admin/analytics' },
  { label: 'Settings', icon: 'settings', path: '/admin/settings' },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brandContainer}>
        <h1 className={styles.brandTitle}>CineAdmin</h1>
        <p className={styles.brandSubtitle}>Global Manager</p>
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

    </aside>
  );
};

export default AdminSidebar;
