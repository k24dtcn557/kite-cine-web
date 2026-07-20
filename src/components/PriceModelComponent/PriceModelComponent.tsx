import React from "react";
import styles from "./PriceModelComponent.module.css";
import { CommonUtils } from "../../utils/CommonUtils";

export interface PriceTier {
  name: string;
  price: number;
}

export interface PriceModelProps {
  title: string;
  icon: string;
  tiers: PriceTier[];
  onEdit?: () => void;
  onDelete?: () => void;
}

const PriceModelComponent: React.FC<PriceModelProps> = ({
  title,
  icon,
  tiers,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.topGradient} />

      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          {icon}
        </span>
      </div>

      <div className={styles.tierList}>
        {tiers.map((tier, index) => (
          <div key={index} className={styles.tierItem}>
            <span className={styles.tierName}>{tier.name}</span>
            <span className={styles.tierPrice}>
              {CommonUtils.formatNumberVietnamese(tier.price)}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={onEdit} title="Edit">
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={onDelete}
          title="Delete"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
};

export default PriceModelComponent;
