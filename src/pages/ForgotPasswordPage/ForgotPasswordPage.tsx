import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./ForgotPasswordPage.module.css";

/* Same luxury theater backdrop used on the Login and SignUp pages */
const THEATER_BG = "/theater-bg.jpg";

const ForgotPasswordPage: React.FC = () => {
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
          <ForgotPasswordForm onBackToLogin={() => navigate("/login")} />
        </div>
      </main>
    </>
  );
};

export default ForgotPasswordPage;
