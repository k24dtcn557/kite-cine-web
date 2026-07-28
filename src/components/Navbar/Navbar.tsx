import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";
import { UserDto } from "../../types/user";

const NAV_LINKS = ["Phim Đang Chiếu", "Sắp Chiếu"];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [userInfo, setUserInfo] = useState<UserDto | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin =
    userInfo?.roles?.some(
      (role: any) => (typeof role === "string" ? role : role.name) === "ADMIN",
    ) || false;

  useEffect(() => {
    if (isAuthenticated) {
      authService
        .getMyInfo()
        .then((user) => setUserInfo(user))
        .catch((err) => {
          console.error("Failed to fetch user info", err);
          logout();
        });
    } else {
      setUserInfo(null);
    }
  }, [isAuthenticated, logout]);

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
            {isAuthenticated ? (
              <div className={styles.userInfoWrapper} ref={dropdownRef}>
                <div
                  className={styles.userInfo}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {userInfo?.avatar ? (
                    <img
                      src={userInfo.avatar}
                      alt="Avatar"
                      className={styles.avatar}
                    />
                  ) : (
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "2rem",
                        color: "var(--color-on-surface-variant)",
                      }}
                    ></span>
                  )}
                  <span className={styles.userName}>{userInfo?.fullName}</span>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "20px",
                      color: "var(--color-on-surface-variant)",
                    }}
                  >
                    expand_more
                  </span>
                </div>
                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    {isAdmin ? (
                      <button
                        className={styles.dropdownItem}
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/admin");
                        }}
                      >
                        <span className="material-symbols-outlined">
                          dashboard
                        </span>
                        Trang quản lý
                      </button>
                    ) : (
                      <>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => {
                            setShowDropdown(false);
                            navigate("/my-cine/tickets");
                          }}
                        >
                          <span className="material-symbols-outlined">
                            confirmation_number
                          </span>
                          Vé của tôi
                        </button>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => {
                            setShowDropdown(false);
                            navigate("/my-cine/profile");
                          }}
                        >
                          <span className="material-symbols-outlined">
                            account_circle
                          </span>
                          Hồ sơ
                        </button>
                      </>
                    )}
                    <button
                      className={`${styles.dropdownItem} ${styles.logout}`}
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                    >
                      <span className="material-symbols-outlined">logout</span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className={styles.signInBtn}
                onClick={() => navigate("/login")}
                aria-label="Sign in"
              >
                <span className="material-symbols-outlined">login</span>
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
