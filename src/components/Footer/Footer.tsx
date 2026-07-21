import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      {/* Brand column */}
      <div className={styles.brand}>
        <span className={styles.logo}>KITE CINE</span>
        <p className={styles.tagline}>
          Hệ thống rạp chiếu phim hàng đầu Việt Nam.
        </p>
      </div>
    </div>

    {/* Copyright */}
    <div className={styles.copyright}>
      <p>© 2026 KiteCine.</p>
    </div>
  </footer>
);

export default Footer;
