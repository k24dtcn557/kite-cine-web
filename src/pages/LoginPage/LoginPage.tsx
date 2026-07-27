import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import LoginForm from "../../components/LoginForm";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./LoginPage.module.css";

const THEATER_BG = "/theater-bg.jpg";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      window.scrollTo(0, 0);
    }
  }, [isAuthenticated, navigate]);

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
            onSignUp={() => navigate("/signup")}
            onForgotPassword={() => navigate("/forgot-password")}
          />
        </div>
      </main>
    </>
  );
};

export default LoginPage;
