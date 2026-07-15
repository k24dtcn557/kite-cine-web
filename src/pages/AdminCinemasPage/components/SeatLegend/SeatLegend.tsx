import React from 'react';
import styles from './SeatLegend.module.css';

const SeatLegend: React.FC = () => {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>LEGEND</h4>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={`${styles.colorBox} ${styles.boxVip}`}></div>
          <span className={styles.label}>VIP Recliner ($24.00)</span>
        </div>
        <div className={styles.item}>
          <div className={`${styles.colorBox} ${styles.boxRegular}`}></div>
          <span className={styles.label}>Regular Seating ($16.00)</span>
        </div>
        <div className={styles.item}>
          <div className={`${styles.colorBox} ${styles.boxAcc}`}></div>
          <span className={styles.label}>Accessible Space ($16.00)</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLegend;
