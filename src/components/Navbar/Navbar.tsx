import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import ThemeToggle from '../ThemeToggle';

const NAV_LINKS = ['Movies', 'Theaters', 'Offers', 'Gift Cards'];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo + Nav Links */}
        <div className={styles.left}>
          <span className={styles.logo}>KiteCine</span>
          <div className={styles.navLinks}>
            {NAV_LINKS.map((link, i) => (
              <button
                key={link}
                className={`${styles.navLink} ${i === 0 ? styles.navLinkActive : ''}`}
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Actions */}
        <div className={styles.right}>
          <div className={styles.searchWrapper}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search movies, actors..."
            />
          </div>
          <div className={styles.actions}>
            <button className={styles.iconBtn} aria-label="Location">
              <span className={`material-symbols-outlined ${styles.actionIcon}`}>location_on</span>
            </button>
            <button
              className={styles.signInBtn}
              onClick={() => navigate('/login')}
              aria-label="Sign in"
            >
              <span className="material-symbols-outlined">person</span>
              Sign In
            </button>
            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
