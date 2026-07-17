import React from 'react';
import styles from './SeatLegend.module.css';

const SeatLegend: React.FC = () => {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>CHÚ GIẢI</h4>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={`${styles.colorBox} ${styles.boxStandard}`}></div>
          <span className={styles.label}>Tiêu chuẩn</span>
        </div>
        <div className={styles.item}>
          <div className={`${styles.colorBox} ${styles.boxVip}`}></div>
          <span className={`material-symbols-outlined ${styles.badgeIcon} ${styles.badgeVip}`}>star</span>
          <span className={styles.label}>VIP</span>
        </div>
        <div className={styles.item}>
          <div className={`${styles.colorBox} ${styles.boxCouple}`}></div>
          <span className={`material-symbols-outlined ${styles.badgeIcon} ${styles.badgeCouple}`}>favorite</span>
          <span className={styles.label}>Cặp đôi</span>
        </div>
        <div className={styles.item}>
          <div className={`${styles.colorBox} ${styles.boxSelected}`}></div>
          <span className={styles.label}>Ghế đã chọn</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLegend;
