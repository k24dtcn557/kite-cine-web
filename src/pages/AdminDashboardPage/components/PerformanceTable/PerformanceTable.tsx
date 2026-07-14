import React from 'react';
import styles from './PerformanceTable.module.css';

interface CinemaPerformance {
  id: string;
  name: string;
  district: string;
  status: 'ACTIVE' | 'FULL';
  revenue: string;
  occupancy: number;
}

const mockCinemas: CinemaPerformance[] = [
  {
    id: '1',
    name: 'Downtown IMAX',
    district: 'Metropolitan District',
    status: 'ACTIVE',
    revenue: '$12,450.00',
    occupancy: 92
  },
  {
    id: '2',
    name: 'Sunset Mall',
    district: 'Westside Retail Park',
    status: 'FULL',
    revenue: '$9,820.00',
    occupancy: 100
  },
  {
    id: '3',
    name: 'Eastside Cine',
    district: 'Residential Hub',
    status: 'ACTIVE',
    revenue: '$7,100.00',
    occupancy: 65
  }
];

const PerformanceTable: React.FC = () => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.title}>Cinema Performance</h4>
          <p className={styles.subtitle}>Ranking of theater clusters by daily yield</p>
        </div>
        <button className={styles.exportBtn}>
          Export Report
        </button>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Location</th>
              <th>Status</th>
              <th>Today's Revenue</th>
              <th>Occupancy</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockCinemas.map((cinema) => (
              <tr key={cinema.id} className={styles.row}>
                {/* Location */}
                <td>
                  <div className={styles.locationCell}>
                    <div className={styles.locationImg} />
                    <div>
                      <p className={styles.locationName}>{cinema.name}</p>
                      <p className={styles.locationDistrict}>{cinema.district}</p>
                    </div>
                  </div>
                </td>
                
                {/* Status */}
                <td>
                  <span className={`${styles.badge} ${cinema.status === 'FULL' ? styles.badgeFull : styles.badgeActive}`}>
                    {cinema.status}
                  </span>
                </td>

                {/* Revenue */}
                <td className={styles.revenueCell}>{cinema.revenue}</td>

                {/* Occupancy */}
                <td>
                  <div className={styles.occupancyCell}>
                    <span className={styles.occupancyText}>{cinema.occupancy}%</span>
                    <div className={styles.progressBar}>
                      <div
                        className={`${styles.progressFill} ${cinema.occupancy === 100 ? styles.progressFull : ''}`}
                        style={{ width: `${cinema.occupancy}%` }}
                      ></div>
                    </div>
                  </div>
                </td>

                {/* Action */}
                <td>
                  <button className={styles.actionBtn}>
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceTable;
