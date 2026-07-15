import React from 'react';
import styles from './BulkActionsBar.module.css';

const BulkActionsBar: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.infoGroup}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>SELECTED SEATS</span>
          <span className={`${styles.infoValue} ${styles.infoPrimary}`}>12 Seats (Row C, Row D)</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>CURRENT TIER</span>
          <span className={styles.infoValue}>Regular Seating</span>
        </div>
      </div>
      
      <div className={styles.actions}>
        <select className={styles.select}>
          <option>Change Tier to VIP</option>
          <option>Change Tier to Regular</option>
          <option>Change Tier to Accessible</option>
          <option>Mark as Out of Service</option>
        </select>
        <button className={styles.applyBtn}>Apply Changes</button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
