import React from 'react';
import styles from './ActivityFeed.module.css';

interface ActivityLog {
  id: string;
  type: 'booking' | 'alert' | 'update';
  title: React.ReactNode;
  time: string;
  description: string;
}

const mockLogs: ActivityLog[] = [
  {
    id: '1',
    type: 'booking',
    title: <><span className={styles.bold}>New Booking</span> at Downtown IMAX</>,
    time: '2 minutes ago',
    description: '"Dune: Part Two"'
  },
  {
    id: '2',
    type: 'alert',
    title: <span className={styles.textPrimary}>System Alert: High Occupancy</span>,
    time: '15 minutes ago',
    description: 'Eastside Cine (98%)'
  },
  {
    id: '3',
    type: 'update',
    title: 'Schedule Update',
    time: '1 hour ago',
    description: 'Sunset Mall updated slots'
  },
  {
    id: '4',
    type: 'booking',
    title: <><span className={styles.bold}>New Booking</span> at Premier Plaza</>,
    time: '1.5 hours ago',
    description: '"Challengers"'
  }
];

const ActivityFeed: React.FC = () => {
  return (
    <div className={styles.feedContainer}>
      <h4 className={styles.title}>Recent Activity</h4>
      
      <div className={styles.logsList}>
        {mockLogs.map((log) => (
          <div key={log.id} className={styles.logItem}>
            <div className={`${styles.dot} ${styles[`dot-${log.type}`]}`}></div>
            <div className={styles.logContent}>
              <p className={styles.logTitle}>{log.title}</p>
              <p className={styles.logTimeDesc}>{log.time} • {log.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.viewAllBtn}>
        View All Logs
      </button>
    </div>
  );
};

export default ActivityFeed;
