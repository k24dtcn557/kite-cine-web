import React from 'react';
import styles from './PickedForYou.module.css';

const RECOMMENDATIONS = [
  { id: 1, title: 'Aftermath', genre: 'Action • 2h 15m', rating: '9.2', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-eSmoZEqznoQ1vFRNsaAGOnZbq9SRNFklCTFi66fmKMiQuyGM88R6enDRob2dwDK1laJ6VxfMocUJvTY9wmf2bCrT81YXZbGInwibjX6CnHJEpIgEC_Cd2j8F4homNfMbDYTV1qN2PX4Vn7kgrOl5YitUYgxJ8ypNhFAvx1KvF7bh2EkjoI81QXcSHe0XeQXKS-W2_V46GlxiWzJh2tqbqWtxKTOcHeerrDsVKbXwPVgUzO1Wvjw5', hiddenOnMobile: false, hiddenOnTablet: false },
  { id: 2, title: 'The Mirror', genre: 'Thriller • 1h 48m', rating: '8.5', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATEyhIXDFBzcp7r0jdof04QyWLLirjJZBXCYoUSSDQ071Wo5yk8FAOVtXyeCuv_i7YKUsUi-M3sJhTQuLGgKI91jQ4mgalUovSi-pccqRz6BBktZmqceknn6w2DTwYEsQUgUpfa5qZROFHoUO53WuGsp2_XiE0gekh0rxl7sxpZOG62FKO50juMa140ss6nYa2jpYit-rTWGbdC14p4iC4ZQ4bcPFQ8Cu26cfcTChpvqZfeA_vS2Zi', hiddenOnMobile: false, hiddenOnTablet: false },
  { id: 3, title: 'Dragon Throne', genre: 'Fantasy • 2h 45m', rating: '9.0', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABOsxnYBCw9OxEzPzuoPq54LNNCu-h2mT_Dj4kPk9ePdMtu03O8VgcGLahQR5ra4vRn_2aZXRht_uPxbuWMP33eeOL8-zcA394xX0YlZctNlQ2xkIuj8JPRWWJLo4_g35kxoVbSwFxyO6hOeprZQxCg9f-es2tmW7FntJbF_b1raJ7XX52eqSEKqzHVhpdkAUsDqooSPiVXhrlRiNhtRzDll3Or3y39AuEv4VFgS0ado52wZv_frLR', hiddenOnMobile: false, hiddenOnTablet: false },
  { id: 4, title: 'Forest Spirits', genre: 'Family • 1h 35m', rating: '8.8', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDhel_DSvRYAkGCsaHlEvURYHaoVSPIy1HAQh2pCVICrF4NghIAtY7K70u1moiJC_R-ky0P2XeNjjSJPrV-5utx0QhlDerJRiKpTi_L_EToMwRYmjjzXqMvZh44NOBoGYa59sP6V0qTNkdOBRHTavHdHyu945RXHgJF_DGyc7jBe6SigjpWLSPVC20VIX6vQqotVXLlkK2HC-fEwsdyyv1OtNNXcO6_ePNrC3IbZUz6x1m4liC6_V5', hiddenOnMobile: true, hiddenOnTablet: false },
  { id: 5, title: 'Solitary Chord', genre: 'Drama • 2h 10m', rating: '9.1', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqw-Bs4EIvlGOhVtKGRn6l37BB1u9-iR5vfjWKtRDISFvAgCgU0hbxtLw8tvdVsixXS70a0PdE-K95M_Kbz7kqgLB4KdOFKOYECTOdpTdSWkTpb2agw3NjqC250CG0yOlFHQrASqZgOiRCT5n4b2ZkTUeA077mEoVf8XgAiiwMN770U2iccoWj1dEX9sHeh2bXMWXDnbe2e0bBw144FOR2lQoPvlqQn8WKvt3p5z89QLB8H7bMK2vs', hiddenOnMobile: true, hiddenOnTablet: true }
];

const PickedForYou: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Picked for You</h2>
        <div className={styles.divider}></div>
        <div className={styles.navButtons}>
          <button className={styles.navBtn}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_left</span>
          </button>
          <button className={styles.navBtn}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          </button>
        </div>
      </div>
      
      <div className={styles.grid}>
        {RECOMMENDATIONS.map(movie => {
          let visibilityClass = '';
          if (movie.hiddenOnMobile) visibilityClass += ` ${styles.hiddenOnMobile}`;
          if (movie.hiddenOnTablet) visibilityClass += ` ${styles.hiddenOnTablet}`;
          
          return (
            <div key={movie.id} className={`${styles.cardWrapper}${visibilityClass}`}>
              <div className={styles.imageContainer}>
                <img src={movie.image} alt={movie.title} className={styles.image} />
                
                <div className={styles.ratingBadge}>
                  <span className={`material-symbols-outlined ${styles.starIcon}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className={styles.ratingText}>{movie.rating}</span>
                </div>
                
                <div className={styles.overlay}>
                  <button className={styles.quickBookBtn}>Quick Book</button>
                </div>
              </div>
              
              <h3 className={styles.movieTitle}>{movie.title}</h3>
              <p className={styles.movieGenre}>{movie.genre}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PickedForYou;
