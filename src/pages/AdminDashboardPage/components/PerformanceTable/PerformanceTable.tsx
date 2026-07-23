import React from "react";
import styles from "./PerformanceTable.module.css";

interface CinemaPerformance {
  id: string;
  name: string;
  district: string;
  status: "ACTIVE" | "FULL";
  revenue: string;
  occupancy: number;
}

const mockCinemas: CinemaPerformance[] = [
  {
    id: "1",
    name: "Kite Cine Quận 1",
    district: "Khu vực trung tâm",
    status: "ACTIVE",
    revenue: "124.500.000 ₫",
    occupancy: 92,
  },
  {
    id: "2",
    name: "Kite Cine Thủ Đức",
    district: "Làng Đại Học",
    status: "FULL",
    revenue: "98.200.000 ₫",
    occupancy: 100,
  },
  {
    id: "3",
    name: "Kite Cine Gò Vấp",
    district: "Khu dân cư",
    status: "ACTIVE",
    revenue: "71.000.000 ₫",
    occupancy: 65,
  },
];

const PerformanceTable: React.FC = () => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.title}>Hiệu suất Rạp chiếu</h4>
          <p className={styles.subtitle}>
            Xếp hạng các cụm rạp theo doanh thu trong ngày
          </p>
        </div>
        <button className={styles.exportBtn}>Xuất báo cáo</button>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Địa điểm</th>
              <th>Trạng thái</th>
              <th>Doanh thu (Hôm nay)</th>
              <th>Tỷ lệ lấp đầy</th>
              <th>Thao tác</th>
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
                      <p className={styles.locationDistrict}>
                        {cinema.district}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`${styles.badge} ${cinema.status === "FULL" ? styles.badgeFull : styles.badgeActive}`}
                  >
                    {cinema.status === "ACTIVE" ? "HOẠT ĐỘNG" : "KÍN CHỖ"}
                  </span>
                </td>

                {/* Revenue */}
                <td className={styles.revenueCell}>{cinema.revenue}</td>

                {/* Occupancy */}
                <td>
                  <div className={styles.occupancyCell}>
                    <span className={styles.occupancyText}>
                      {cinema.occupancy}%
                    </span>
                    <div className={styles.progressBar}>
                      <div
                        className={`${styles.progressFill} ${cinema.occupancy === 100 ? styles.progressFull : ""}`}
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
