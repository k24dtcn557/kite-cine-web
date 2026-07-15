import React, { useState } from 'react';
import styles from './SeatMap.module.css';

const SeatMap: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  // Generate 8 rows (A-H), 10 seats per row
  const rows = Array.from({ length: 8 }).map((_, i) => String.fromCharCode(65 + i));
  const seatsPerRow = 10;

  const toggleSeat = (id: string) => {
    setSelectedSeats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.container}>
      {/* Background Decor */}
      <div className={styles.glowDecor}></div>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Screen 4 Layout</h3>
          <p className={styles.subtitle}>Interactive seat mapping and pricing tier allocation.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.resetBtn}>
            <span className="material-symbols-outlined">settings_backup_restore</span> Reset
          </button>
          <button className={styles.saveBtn}>
            <span className="material-symbols-outlined">save</span> Save Config
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className={styles.mapArea}>
        {/* Screen Projection */}
        <div className={styles.screenProjection}>
          <span className={styles.screenLabel}>IMAX PROJECTION SCREEN</span>
        </div>

        {/* Seat Grid */}
        <div className={styles.grid}>
          {rows.map((rowLabel, rowIdx) => (
            <React.Fragment key={rowLabel}>
              <div className={styles.rowLabel}>{rowLabel}</div>
              <div className={styles.seatRow}>
                {Array.from({ length: seatsPerRow }).map((_, seatIdx) => {
                  const id = `${rowLabel}${seatIdx + 1}`;
                  const isVip = rowIdx < 2;
                  const isAcc = rowIdx === 7 && (seatIdx === 0 || seatIdx === 9);
                  const isSelected = selectedSeats.has(id);

                  let seatClass = styles.seatRegular;
                  if (isVip) seatClass = styles.seatVip;
                  else if (isAcc) seatClass = styles.seatAcc;

                  return (
                    <div 
                      key={id}
                      className={`${styles.seat} ${seatClass} ${isSelected ? styles.seatSelected : ''}`}
                      onClick={() => toggleSeat(id)}
                      title={`Seat ${id}`}
                    >
                      <span className={styles.seatNumber}>{seatIdx + 1}</span>
                      {isVip && (
                        <span className={`material-symbols-outlined ${styles.vipStar}`}>star</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
