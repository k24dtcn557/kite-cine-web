import React from "react";
import { MetricCard, RevenueChart, PerformanceTable } from "./components";
import styles from "./AdminDashboardPage.module.css";

const AdminDashboardPage: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Dashboard Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Tổng quan Hệ thống</h2>
        <p className={styles.subtitle}>
          Hiệu suất hoạt động theo thời gian thực của các rạp chiếu.
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Tổng doanh thu"
          value="248.590.000 ₫"
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
          title="Rạp đang hoạt động"
          value="12 Rạp"
          icon="location_on"
          iconBgColor="tertiary"
          iconColor="tertiary"
          badgeText="Toàn quốc"
          subtext="Hoạt động bình thường"
        />
        <MetricCard
          title="Tổng số vé (Hôm nay)"
          value="4.219"
          icon="confirmation_number"
          iconBgColor="secondary"
          iconColor="secondary"
          badgeIcon="bolt"
          badgeText="Nhu cầu cao"
          badgeColor="primary"
          subtext="Cao điểm: 19:00 - 21:00"
        />
        <MetricCard
          title="Tỷ lệ lấp đầy TB"
          value="78,4%"
          icon="event_seat"
          iconBgColor="surface"
          iconColor="surface"
          badgeText="TB Hàng ngày"
          progressMode="segmented"
          progressValue={75}
        />
      </div>
      {/* Middle Section: Chart */}
      <div style={{ marginBottom: "2.5rem" }}>
        <RevenueChart />
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
