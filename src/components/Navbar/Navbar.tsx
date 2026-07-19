import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import ThemeToggle from "../ThemeToggle";

const NAV_LINKS = ["Phim Đang Chiếu", "Sắp Chiếu", "Thành Viên"];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (link: string) => {
    navigate("/");
    setTimeout(() => {
      if (link === "Phim Đang Chiếu") {
        document
          .getElementById("now-playing")
          ?.scrollIntoView({ behavior: "smooth" });
      } else if (link === "Sắp Chiếu") {
        document
          .getElementById("coming-soon")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}
    >
      <div className={styles.inner}>
        {/* Logo + Nav Links */}
        <div className={styles.left}>
          <span
            className={styles.logo}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            KITECINE
          </span>
          <div className={styles.navLinks}>
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className={styles.navLink}
                onClick={() => handleNavClick(link)}
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Actions */}
        <div className={styles.right}>
          <div className={styles.actions}>
            <ThemeToggle />
            <button
              className={styles.signInBtn}
              onClick={() => navigate("/login")}
              aria-label="Sign in"
            >
              <span className="material-symbols-outlined">person</span>
              Đăng nhập
            </button>
            {/* Theme toggle */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
