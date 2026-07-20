import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "./ThemeToggle.module.css";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Track */}
      <span
        className={`${styles.track} ${isDark ? styles.trackDark : styles.trackLight}`}
      >
        {/* Thumb with icon */}
        <span
          className={`${styles.thumb} ${isDark ? styles.thumbDark : styles.thumbLight}`}
        >
          <span
            className={`material-symbols-outlined icon-filled ${styles.icon}`}
          >
            {isDark ? "dark_mode" : "light_mode"}
          </span>
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
