import React, { useState, useEffect } from "react";
import { MetricCard, RevenueChart } from "./components";
import styles from "./AdminDashboardPage.module.css";
import { managementService } from "../../services/management.service";
import { QuickStatsDto } from "../../types/booking";
import { CommonUtils } from "../../utils/CommonUtils";

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<QuickStatsDto | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await managementService.getQuickStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch quick stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={styles.container}>
      {/* Dashboard Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Báo cáo nhanh</h2>
      </div>

      {/* Key Metrics Row */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Rạp & Phòng chiếu"
          value={
            stats
              ? `${stats.totalCinemas} Rạp / ${stats.totalAuditoriums} Phòng`
              : "..."
          }
          icon="location_on"
          iconBgColor="tertiary"
          iconColor="tertiary"
        />
        <MetricCard
          title="Doanh thu hôm nay"
          value={
            stats ? CommonUtils.formatNumberVietnamese(stats.revenue) : "..."
          }
          icon="payments"
          iconBgColor="primary"
          iconColor="primary"
        />
        <MetricCard
          title="Tổng số ghế đã bán"
          value={stats ? stats.totalSoldSeats.toLocaleString("vi-VN") : "..."}
          icon="confirmation_number"
          iconBgColor="secondary"
          iconColor="secondary"
        />
        <MetricCard
          title="Tỷ lệ lấp đầy"
          value={stats ? `${(stats.fillRate * 100).toFixed(1)}%` : "..."}
          icon="event_seat"
          iconBgColor="surface"
          iconColor="surface"
          progressMode="segmented"
          progressValue={stats ? stats.fillRate * 100 : 0}
        />
      </div>
      {/* Middle Section: Chart */}
      <div style={{ marginBottom: "2.5rem" }}>
        <RevenueChart />
      </div>

      {/* Floating Action Button */}
      <button className={styles.fab}>
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
};

export default AdminDashboardPage;
