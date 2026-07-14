import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../../components';
import LoginForm from '../../components/LoginForm';
import styles from './LoginPage.module.css';

const THEATER_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDwQ6zV1EEzrZ6IKOzZAfFnmdbYb0n-mFL8n7ULo7w2282RHnOIrpxkz4iWO50MEUqx52k3ziEFEw56xB2IDdJdCKC8iR4ZIDd2ofdvrViSoq4GQSHyt3EBYhHIv__f9T2GgAAhqT1O6MHhqo3RntyVqgdb0p7IXvqU3OnYFVl1zX1AQlXKxpF7DVH4O2nCopLcfTCbL6_dGAAcEqHF8EalXLeB06cUHYkXPrBEL6_fCLRTbQU0bagc";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        {/* Cinematic background */}
        <div className={styles.backdrop} aria-hidden="true">
          <div
            className={styles.backdropImg}
            style={{ backgroundImage: `url('${THEATER_BG}')` }}
            role="img"
            aria-label="Luxury movie theater interior"
          />
          <div className={styles.cinematicOverlay} />
        </div>

        {/* Login card */}
        <div className={styles.cardWrapper}>
          <LoginForm
            onSignUp={() => navigate('/signup')}
            onForgotPassword={() => navigate('/forgot-password')}
          />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default LoginPage;
