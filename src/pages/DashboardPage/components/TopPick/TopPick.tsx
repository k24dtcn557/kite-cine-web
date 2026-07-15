import React from 'react';
import styles from './TopPick.module.css';

const TopPick: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Top Pick</h2>
      </div>
      <div className={styles.card}>
        <div className={styles.imageSection}>
          <div 
            className={styles.imageBg} 
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCSkQNfDdoLyy40cDpIu7Un0VQCoC0QupL7RiX95yXbmL_xZHPHQ1IRURtLDCXRR1rvbo6sRshUDvJ5uYZJUPipTiGyVTAD-Bh7eJg1995CdyftxQMudHBy98zLviEDhzcN9Ey4gjewBsIZIzjavH1PfPNm8P5HPEM5lkUfCVY3Hdy3wS8XpVgGLgGb8TahZU9hyaBjc1cy8DXz6i1LHOe19K8sN1OZhWGJdkzSpxB7Efgv6gvZTuxC')` }}
          ></div>
          <div className={styles.gradientOverlay}></div>
          <div className={styles.imageContent}>
            <p className={styles.badge}>FAVORITE RE-WATCH</p>
            <h3 className={styles.movieTitle}>Neon Horizon</h3>
          </div>
        </div>
        <div className={styles.cardBody}>
          <p className={styles.description}>
            You've seen this 3 times. Still showing at Grand Cinema 12.
          </p>
          <button className={styles.rebookBtn}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>event_repeat</span>
            Rebook for $12.00
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopPick;
