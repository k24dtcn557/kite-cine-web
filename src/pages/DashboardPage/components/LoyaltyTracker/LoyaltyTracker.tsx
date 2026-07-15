import React, { useEffect, useState } from 'react';
import styles from './LoyaltyTracker.module.css';

const LoyaltyTracker: React.FC = () => {
  const [progressWidth, setProgressWidth] = useState('0%');

  useEffect(() => {
    // Animate on load
    const timer = setTimeout(() => {
      setProgressWidth('82%');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.trackerContainer}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Gold Member Status</h2>
          <p className={styles.subtitle}>You've reached the top 5% of film lovers this year!</p>
        </div>
        <div className={styles.pointsBadge}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          <span>4,250 PTS</span>
        </div>
      </div>
      
      <div className={styles.progressSection}>
        <div className={styles.progressLabels}>
          <span className={styles.tierLabel}>GOLD</span>
          <span className={styles.pointsNeeded}>750 pts to PLATINUM</span>
          <span className={styles.tierLabel}>PLATINUM</span>
        </div>
        <div className={styles.progressBarBg}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: progressWidth }}
            id="loyalty-progress"
          ></div>
        </div>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <p className={styles.statLabel}>Movies Seen</p>
          <p className={styles.statValue}>24</p>
        </div>
        <div className={styles.statItemBordered}>
          <p className={styles.statLabel}>Free Snacks</p>
          <p className={styles.statValue}>3 Pending</p>
        </div>
        <div className={styles.statItemLast}>
          <p className={styles.statLabel}>Savings</p>
          <p className={styles.statValue}>$142.50</p>
        </div>
      </div>
    </section>
  );
};

export default LoyaltyTracker;
