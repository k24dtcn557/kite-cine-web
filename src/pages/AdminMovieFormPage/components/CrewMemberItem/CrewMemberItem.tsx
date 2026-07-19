import React from "react";
import styles from "./CrewMemberItem.module.css";

import {
  CrewMemberDto,
  CrewRole,
  CREW_ROLE_LABELS,
} from "../../../../api/movie.service";

interface CrewMemberItemProps {
  member: CrewMemberDto;
  onDelete: () => void;
}

export const CrewMemberItem: React.FC<CrewMemberItemProps> = ({
  member,
  onDelete,
}) => {
  return (
    <div className={styles.castItem}>
      <div className={styles.castAvatar}>
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className={styles.avatarImg}
          />
        ) : (
          <span className="material-symbols-outlined">person</span>
        )}
      </div>
      <div className={styles.castInfo}>
        <div className={styles.castName}>{member.name || "Unknown"} </div>
        <div className={styles.castRole}>
          {CREW_ROLE_LABELS[member.role as CrewRole] ||
            member.role ||
            "Unknown"}
        </div>
      </div>
      <button className={styles.deleteCastBtn} onClick={onDelete}>
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
};
