import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import SignUpForm from "../../components/SignUpForm";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./SignUpPage.module.css";

/* Same luxury theater backdrop used on the Login page */
const THEATER_BG = "/theater-bg.jpg";

const SignUpPage: React.FC = () => {
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

        {/* Registration card */}
        <div className={styles.cardWrapper}>
          <SignUpForm onLogIn={() => navigate("/login")} />
        </div>
      </main>
    </>
  );
};

export default SignUpPage;
