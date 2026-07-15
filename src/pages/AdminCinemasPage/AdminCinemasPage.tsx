import React, { useState } from 'react';
import styles from './AdminCinemasPage.module.css';
import { CinemaList, AuditoriumTabs, SeatMap, SeatLegend, SeatControls, BulkActionsBar } from './components';

const AdminCinemasPage: React.FC = () => {
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | undefined>();

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumbs / Stepper */}
      <div className={styles.breadcrumb}>
        <div className={`${styles.crumbItem} ${styles.crumbActive}`}>
          <span className="material-symbols-outlined">location_on</span>
          <span className={styles.crumbText}>Downtown IMAX</span>
        </div>
        <span className={`material-symbols-outlined ${styles.chevron}`}>chevron_right</span>
        <div className={`${styles.crumbItem} ${styles.crumbActive}`}>
          <span className="material-symbols-outlined">videocam</span>
          <span className={styles.crumbText}>Auditorium 4 (IMAX)</span>
        </div>
        <span className={`material-symbols-outlined ${styles.chevron}`}>chevron_right</span>
        <div className={`${styles.crumbItem} ${styles.crumbInactive}`}>
          <span className="material-symbols-outlined">grid_view</span>
          <span className={styles.crumbText}>Seat Configuration</span>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Level 1: Cinema List (Left Column) */}
        <section className={styles.leftCol}>
          <CinemaList 
            selectedCinemaId={selectedCinemaId} 
            onSelectCinema={setSelectedCinemaId} 
          />
        </section>

        {/* Level 2 & 3: Auditorium and Seat Config (Right Column) */}
        <section className={styles.rightCol}>
          <AuditoriumTabs cinemaId={selectedCinemaId} />
          
          <SeatMap />
          
          <div className={styles.statsGrid}>
            <SeatLegend />
            <SeatControls />
          </div>
          
          <BulkActionsBar />
        </section>
      </div>
    </div>
  );
};

export default AdminCinemasPage;
