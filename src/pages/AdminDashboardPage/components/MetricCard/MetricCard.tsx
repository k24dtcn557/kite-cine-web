import React from "react";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  iconBgColor: "primary" | "secondary" | "tertiary" | "surface";
  iconColor: "primary" | "secondary" | "tertiary" | "surface";
  progressMode?: "single" | "segmented";
  progressValue?: number; // 0 to 100
  subtext?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  progressMode,
  progressValue = 0,
  subtext,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div
          className={`${styles.iconContainer} ${styles[`bg-${iconBgColor}`]} ${styles[`text-${iconColor}`]}`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>

      <p className={styles.title}>{title}</p>
      <h3 className={styles.value}>{value}</h3>

      {subtext && <p className={styles.subtext}>{subtext}</p>}

      {progressMode === "single" && (
        <div className={styles.progressSingle}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
      )}

      {progressMode === "segmented" && (
        <div className={styles.progressSegmented}>
          {[1, 2, 3, 4].map((segment) => {
            // Rough logic for segmented fill (25% per segment)
            const isFilled = progressValue >= segment * 25 - 12.5; // Halfway threshold
            return (
              <div
                key={segment}
                className={`${styles.segment} ${isFilled ? styles.segmentFilled : styles.segmentEmpty}`}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
