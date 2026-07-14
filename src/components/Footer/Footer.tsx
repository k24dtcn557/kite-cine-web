import React from 'react';
import styles from './Footer.module.css';

const FOOTER_LINKS = {
  Experience: ['IMAX Experience', 'Dolby Cinema', 'RealD 3D', 'VIP Lounges'],
  'Quick Links': ['Theaters', 'Gift Cards', 'Offers', 'CineClub'],
  Support: ['Support', 'Privacy Policy', 'Terms of Service', 'Accessibility'],
};

const SOCIAL_ICONS = [
  { icon: 'public', label: 'Website' },
  { icon: 'play_circle', label: 'YouTube' },
  { icon: 'share', label: 'Share' },
];

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      {/* Brand column */}
      <div className={styles.brand}>
        <span className={styles.logo}>KiteCine</span>
        <p className={styles.tagline}>
          Elevating the cinematic experience since 1994. Premium formats, ultimate comfort,
          and the world's best stories.
        </p>
        <div className={styles.socials}>
          {SOCIAL_ICONS.map(({ icon, label }) => (
            <button
              key={icon}
              className={styles.socialLink}
              aria-label={label}
            >
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Link columns */}
      {Object.entries(FOOTER_LINKS).map(([category, links]) => (
        <div key={category} className={styles.linkGroup}>
          <h4 className={styles.groupHeading}>{category}</h4>
          <ul className={styles.linkList}>
            {links.map((link) => (
              <li key={link}>
                <button className={styles.link}>
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Copyright */}
    <div className={styles.copyright}>
      <p>© 2024 KiteCine Entertainment. All Rights Reserved.</p>
    </div>
  </footer>
);

export default Footer;
