import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar, AdminTopbar } from "../../components";
import styles from "./AdminLayout.module.css";
import { authService } from "../../services/auth.service";
import toast from "react-hot-toast";

const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate("/");
          return;
        }
        const user = await authService.getMyInfo();
        const hasAdminRole = user.roles?.some(
          (role: any) =>
            (typeof role === "string" ? role : role.name) === "ADMIN",
        );

        if (!hasAdminRole) {
          toast.error("Trang bạn đang truy cập không tồn tại.");
          navigate("/");
        } else {
          setIsCheckingRole(false);
        }
      } catch (error) {
        navigate("/");
      }
    };
    checkRole();
  }, [navigate]);

  if (isCheckingRole) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "var(--color-surface)",
          color: "var(--color-on-surface)",
        }}
      >
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Fixed Sidebar */}
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        {/* Fixed Topbar */}
        <AdminTopbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Content Canvas */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
