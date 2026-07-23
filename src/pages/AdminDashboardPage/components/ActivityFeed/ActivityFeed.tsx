import React from "react";
import styles from "./ActivityFeed.module.css";

interface ActivityLog {
  id: string;
  type: "booking" | "alert" | "update";
  title: React.ReactNode;
  time: string;
  description: string;
}

const mockLogs: ActivityLog[] = [
  {
    id: "1",
    type: "booking",
    title: (
      <>
        <span className={styles.bold}>Đặt vé mới</span> tại Rạp Quận 1
      </>
    ),
    time: "2 phút trước",
    description: '"Dune: Hành Tinh Cát 2"',
  },
  {
    id: "2",
    type: "alert",
    title: (
      <span className={styles.textPrimary}>Cảnh báo: Tỷ lệ lấp đầy cao</span>
    ),
    time: "15 phút trước",
    description: "Rạp Thủ Đức (98%)",
  },
  {
    id: "3",
    type: "update",
    title: "Cập nhật lịch chiếu",
    time: "1 giờ trước",
    description: "Rạp Gò Vấp cập nhật suất chiếu",
  },
  {
    id: "4",
    type: "booking",
    title: (
      <>
        <span className={styles.bold}>Đặt vé mới</span> tại Rạp Quận 7
      </>
    ),
    time: "1.5 giờ trước",
    description: '"Mai"',
  },
];

const ActivityFeed: React.FC = () => {
  return (
    <div className={styles.feedContainer}>
      <h4 className={styles.title}>Hoạt động gần đây</h4>

      <div className={styles.logsList}>
        {mockLogs.map((log) => (
          <div key={log.id} className={styles.logItem}>
            <div className={`${styles.dot} ${styles[`dot-${log.type}`]}`}></div>
            <div className={styles.logContent}>
              <p className={styles.logTitle}>{log.title}</p>
              <p className={styles.logTimeDesc}>
                {log.time} • {log.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.viewAllBtn}>
        Xem tất cả nhật ký{" "}
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
  );
};

export default ActivityFeed;
