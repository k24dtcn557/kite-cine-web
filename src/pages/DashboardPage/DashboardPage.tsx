import React from 'react';
import { LoyaltyTracker, RecentJourney, TopPick, PickedForYou } from './components';
import styles from './DashboardPage.module.css';

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Header Area */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <p className={styles.welcomeLabel}>WELCOME BACK, ALEX</p>
          <h1 className={styles.title}>Your CineJourney</h1>
        </div>
        
        <div className={styles.headerActions}>
          <button className={styles.primaryAction}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '0.875rem' }}>confirmation_number</span>
            My Tickets
          </button>
          <button className={styles.secondaryAction}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>redeem</span>
            Redeem
          </button>
        </div>
      </div>
      
      {/* Loyalty Tracker */}
      <LoyaltyTracker />
      
      {/* Middle Grid */}
      <div className={styles.middleGrid}>
        <div className={styles.journeyWrapper}>
          <RecentJourney />
        </div>
        <div className={styles.topPickWrapper}>
          <TopPick />
        </div>
      </div>
      
      {/* Picked For You */}
      <PickedForYou />
      
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>CINEPLEX</div>
            <p className={styles.footerDesc}>Elevating the cinematic experience since 1995. Premium visuals, immersive sound.</p>
            <p className={styles.footerCopyright}>© 2024 Cineplex Entertainment. All rights reserved.</p>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <span className={styles.linkGroupTitle}>Support</span>
              <a href="/" className={styles.link}>Terms</a>
              <a href="/" className={styles.link}>Privacy</a>
            </div>
            <div className={styles.linkGroup}>
              <span className={styles.linkGroupTitle}>Explore</span>
              <a href="/" className={styles.link}>Theaters</a>
              <a href="/" className={styles.link}>Promos</a>
            </div>
          </div>
          
          <div className={styles.footerSocial}>
            <div className={styles.socialIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>language</span>
            </div>
            <div className={styles.socialIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>share</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
