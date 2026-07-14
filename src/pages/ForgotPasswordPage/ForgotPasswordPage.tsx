import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../../components';
import ForgotPasswordForm from '../../components/ForgotPasswordForm';
import styles from './ForgotPasswordPage.module.css';

/* Same luxury theater backdrop used on the Login and SignUp pages */
const THEATER_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDwQ6zV1EEzrZ6IKOzZAfFnmdbYb0n-mFL8n7ULo7w2282RHnOIrpxkz4iWO50MEUqx52k3ziEFEw56xB2IDdJdCKC8iR4ZIDd2ofdvrViSoq4GQSHyt3EBYhHIv__f9T2GgAAhqT1O6MHhqo3RntyVqgdb0p7IXvqU3OnYFVl1zX1AQlXKxpF7DVH4O2nCopLcfTCbL6_dGAAcEqHF8EalXLeB06cUHYkXPrBEL6_fCLRTbQU0bagc';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        {/* Cinematic backdrop */}
        <div className={styles.backdrop} aria-hidden="true">
          <div
            className={styles.backdropImg}
            style={{ backgroundImage: `url('${THEATER_BG}')` }}
            role="img"
            aria-label="Luxury movie theater interior"
          />
          <div className={styles.cinematicOverlay} />
        </div>

        {/* Forgot Password card */}
        <div className={styles.cardWrapper}>
          <ForgotPasswordForm onBackToLogin={() => navigate('/login')} />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
