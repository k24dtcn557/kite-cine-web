import React from 'react';
import {
  MetricCard,
  RevenueChart,
  ActivityFeed,
  PerformanceTable,
} from './components';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Dashboard Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Global Network Overview</h2>
        <p className={styles.subtitle}>Real-time performance across 12 active cinema locations.</p>
      </div>

      {/* Key Metrics Row */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Total Revenue"
          value="$248,590.00"
          icon="payments"
          iconBgColor="primary"
          iconColor="primary"
          badgeIcon="trending_up"
          badgeText="+12.5%"
          badgeColor="secondary"
          progressMode="single"
          progressValue={75}
        />
        <MetricCard
          title="Active Cinemas"
          value="12 Locations"
          icon="location_on"
          iconBgColor="tertiary"
          iconColor="tertiary"
          badgeText="Global Hub"
          subtext="All locations online"
        />
        <MetricCard
          title="Total Bookings (Today)"
          value="4,219"
          icon="confirmation_number"
          iconBgColor="secondary"
          iconColor="secondary"
          badgeIcon="bolt"
          badgeText="High Demand"
          badgeColor="primary"
          subtext="Peak: 19:00 - 21:00"
        />
        <MetricCard
          title="Average Occupancy"
          value="78.4%"
          icon="event_seat"
          iconBgColor="surface"
          iconColor="surface"
          badgeText="Avg. Daily"
          progressMode="segmented"
          progressValue={75}
        />
      </div>

      {/* Middle Section: Chart & Feed */}
      <div className={styles.middleSection}>
        <div className={styles.chartWrapper}>
          <RevenueChart />
        </div>
        <div className={styles.feedWrapper}>
          <ActivityFeed />
        </div>
      </div>

      {/* Bottom Section: Table */}
      <PerformanceTable />

      {/* Floating Action Button */}
      <button className={styles.fab}>
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
};

export default AdminDashboardPage;
