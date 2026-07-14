import React from 'react';
import styles from './RevenueChart.module.css';

const RevenueChart: React.FC = () => {
  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.title}>Network Revenue Trends</h4>
          <p className={styles.subtitle}>Weekly financial performance overview</p>
        </div>
        <select className={styles.select}>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last Quarter</option>
        </select>
      </div>

      <div className={styles.chartArea}>
        {/* Grid lines */}
        <div className={styles.gridLines}>
          <div className={styles.gridLine}></div>
          <div className={styles.gridLine}></div>
          <div className={styles.gridLine}></div>
          <div className={styles.gridLine}></div>
        </div>

        {/* Bars */}
        <div className={styles.bars}>
          <div className={styles.bar} style={{ height: '40%' }}>
            <div className={styles.tooltip}>Mon</div>
          </div>
          <div className={styles.bar} style={{ height: '60%' }}></div>
          <div className={styles.bar} style={{ height: '45%' }}></div>
          <div className={styles.bar} style={{ height: '80%' }}></div>
          <div className={`${styles.bar} ${styles.barHighlight}`} style={{ height: '95%' }}></div>
          <div className={styles.bar} style={{ height: '70%' }}></div>
          <div className={`${styles.bar} ${styles.barToday}`} style={{ height: '85%' }}>
            <div className={styles.tooltipToday}>Today</div>
          </div>
        </div>
      </div>

      {/* X-Axis labels */}
      <div className={styles.xAxis}>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
};

export default RevenueChart;
