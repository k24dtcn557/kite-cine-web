import React from 'react';
import styles from './RecentJourney.module.css';

const JOURNEY_ITEMS = [
  { id: 1, title: 'The Silent Echo', date: 'Oct 12, 2024', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAAbKEMjRiospFGWS8MjUgkKOwYNdQaDhjW4bddjTMg_2IkeThfG-JLMV8R7R4cGt0St10ybbQJRLKWvndg9ASMwc5Evkg04j91SsZih4WMjqGNvIlPkzz49HzrNwUvCVCrGpHAv8iqlkA95FYxncF3T-e4X97OEQHmMOkluyR9wl3ELJ5WcxXE5dGJ-rM_nYT_pPjVmGbnEfskIJllc4pQS6N8H371rwt1EYr5fecmvwBt5H24LK0' },
  { id: 2, title: 'Structure X', date: 'Oct 05, 2024', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAk7N6smwe7oe73fTCCG7Lxy9n47rJMoo-bX-kNIGauhf9Qe9hCc4FryhHLWwSAjJEQ-AGWZRaUc3V9RHRxGGM-AYPvU_RUwe_Jb5X6sDYjF-pgfO_ni65fzGcjC6AJ06arLedEFyUqgyK_UZI610uoSgQDVhI6Eua_zybvW2tGy2-fMDvlMtl2CXzLPEgqI2mIzFkrmyx7FiyQptuHC5AMMf5aNPRqNHZuos02p95tC0mAoc_7KjM' },
  { id: 3, title: 'Void Walker', date: 'Sep 28, 2024', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZRgRvMeFR73V3qo3l-93HEs0B2grJmaeghayV1PCeVWjjysQhBCy0WBjQ3dVDgnfmsr1R90Px3kUUbsC5MpOZR742HRy7g9-6_41G2dfs9cxYooBkwm2HhLTzC4ike2EzdnoShjcFOXLmHkxDgyBBnDTjkWKB0KxcJV7VDTI-U9EGe0GxOYYkGTTK7_GDR6E6H2QlMj-PRrDrPhozbBEvQ9REHnbh0STAo4xQ8ISJSpnB3VbBFWwU' },
  { id: 4, title: 'Midnight Confession', date: 'Sep 15, 2024', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9p_R9K6aAx2UhgWQwRXf_TCakJbF5vsAWVeeDZYRQDfGpTIuUYJSFN6FWU_NzRw-wafjq2q06WVpiGHUSmK-LDY3LzW7vngbrRC-48OqsQzxnR5j9rw8HCxILTBX4bLFNWTAXL2cBfv--TRy11jCuz_ccXiIhQgPo0X-F70_CLtriVwjeQ_fDFqN-MGLqAQ4cWUAbbQCLVXs8Im4fQcPHYb9jDLp4UYxMlmctdlnxYVATgzhzI4Qt' }
];

const RecentJourney: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent CineJourney</h2>
        <button className={styles.historyBtn}>HISTORY</button>
      </div>
      <div className={styles.grid}>
        {JOURNEY_ITEMS.map(item => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={item.image} alt={item.title} className={styles.image} />
              <div className={styles.overlay}></div>
            </div>
            <div className={styles.info}>
              <h4 className={styles.itemTitle}>{item.title}</h4>
              <p className={styles.itemDate}>{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentJourney;
