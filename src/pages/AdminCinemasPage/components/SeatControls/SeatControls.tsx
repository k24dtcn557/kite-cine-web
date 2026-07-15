import React from 'react';
import styles from './SeatControls.module.css';

const SeatControls: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        <h4 className={styles.title}>SEAT MANAGEMENT</h4>
        <div className={styles.actions}>
          <button className={styles.editBtn}>
            <span className={`material-symbols-outlined ${styles.icon}`}>edit</span>
            <span>Enable Edit Mode</span>
          </button>
          <div className={styles.btnGroup}>
            <button className={styles.controlBtn} disabled>
              <span className={`material-symbols-outlined ${styles.controlBtnIcon}`}>add</span> Add Seat
            </button>
            <button className={styles.controlBtn} disabled>
              <span className={`material-symbols-outlined ${styles.controlBtnIcon}`}>remove</span> Remove Seat
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.container}>
        <div>
          <h4 className={styles.title}>TIER ACTIONS</h4>
          <div className={styles.tierGroup}>
            <button className={styles.tierBtn}>Bulk Select Row</button>
            <button className={styles.tierBtn}>Mirror Layout</button>
            <button className={styles.tierBtn}>Clear Selection</button>
          </div>
        </div>
        <div className={styles.footer}>
          <p className={styles.footerText}>Last synced: 2 mins ago by Admin_Sarah</p>
        </div>
      </div>
    </>
  );
};

export default SeatControls;
