import React, { useState, useEffect } from "react";
import styles from "./AdminUsersPage.module.css";
import { managementService } from "../../api/management.service";
import { UserDto } from "../../api/auth.service";
import toast from "react-hot-toast";

const getRoleDisplayName = (role?: string) => {
  if (!role) return "Thành viên Tiêu chuẩn";
  const upperRole = role.toUpperCase();
  if (upperRole.includes("ADMIN")) return "Quản trị viên";
  if (upperRole.includes("MANAGER")) return "Quản lý rạp";
  if (upperRole.includes("PREMIUM")) return "Thành viên Premium";
  return "Thành viên Tiêu chuẩn";
};

const getRoleBadgeClass = (displayRole: string) => {
  switch (displayRole) {
    case "Quản trị viên":
      return styles.badgeAdmin;
    case "Quản lý rạp":
      return styles.badgeManager;
    case "Thành viên Premium":
      return styles.badgePremium;
    case "Thành viên Tiêu chuẩn":
      return styles.badgeStandard;
    default:
      return styles.badgeStandard;
  }
};

const AdminUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tất cả vai trò");

  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // We map display names to backend roles if necessary, or pass empty for "All Roles"
  const getBackendRole = (displayRole: string) => {
    switch (displayRole) {
      case "Quản trị viên":
        return "ADMIN";
      case "Quản lý rạp":
        return "MANAGER";
      case "Thành viên Premium":
        return "PREMIUM";
      case "Thành viên Tiêu chuẩn":
        return "USER";
      default:
        return undefined;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const payload = {
          keyword: searchQuery || undefined,
          role: getBackendRole(selectedRole),
          page: page,
          size: 10,
        };
        const response = await managementService.searchUsers(payload);
        setUsers(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotalElements(response.totalElements || 0);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Không thể tải danh sách người dùng.");
      } finally {
        setIsLoading(false);
      }
    };

    // Simple debounce logic for search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedRole, page]);

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.pageTitle}>Quản lý người dùng</h2>
          <p className={styles.subtitle}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "14px" }}
            >
              group
            </span>
            Tổng số: {totalElements}
          </p>
        </div>
        <button className={styles.btnAddUser}>
          <span className="material-symbols-outlined">person_add</span>
          Thêm người dùng
        </button>
      </div>

      {/* Filter Bar */}
      <div className={`${styles.glassPanel} ${styles.filterBar}`}>
        {/* Search Input */}
        <div className={styles.searchContainer}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>
            search
          </span>
          <input
            className={styles.searchInput}
            placeholder="Tìm theo tên, tên đăng nhập, hoặc email..."
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0); // reset page on search
            }}
          />
        </div>

        {/* Filters */}
        <div className={styles.filtersWrapper}>
          <div className={styles.roleFilter}>
            <span className={styles.roleLabel}>Vai trò:</span>
            <div className={styles.selectWrapper}>
              <select
                className={styles.roleSelect}
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setPage(0); // reset page on filter
                }}
              >
                <option>Tất cả vai trò</option>
                <option>Quản trị viên</option>
                <option>Quản lý rạp</option>
                <option>Thành viên Premium</option>
                <option>Thành viên Tiêu chuẩn</option>
              </select>
              <span
                className={`material-symbols-outlined ${styles.selectIcon}`}
              >
                expand_more
              </span>
            </div>
          </div>
          <button className={styles.btnTune} title="Bộ lọc nâng cao">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* User Table Container */}
      <div className={`${styles.glassPanel} ${styles.tableContainer}`}>
        <div className={styles.tableScroll}>
          <table className={styles.userTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Tên</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Vai trò</th>
                <th className={styles.alignRight}>Hành động</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const firstRole =
                    Array.isArray(user.roles) && user.roles.length > 0
                      ? typeof user.roles[0] === "string"
                        ? user.roles[0]
                        : user.roles[0].name
                      : undefined;
                  const displayRole = getRoleDisplayName(firstRole);

                  return (
                    <tr key={user.id} className={styles.tableRow}>
                      <td>
                        <div className={styles.userInfo}>
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={`${user.fullName} Avatar`}
                              className={styles.avatar}
                            />
                          ) : (
                            <div className={styles.avatarFallback}>
                              {user.fullName
                                ? user.fullName.charAt(0).toUpperCase()
                                : "?"}
                            </div>
                          )}
                          <span className={styles.userName}>
                            {user.fullName}
                          </span>
                        </div>
                      </td>
                      <td className={styles.textMuted}>{user.username}</td>
                      <td className={styles.textMuted}>{user.email}</td>
                      <td className={styles.textMuted}>
                        {user.phoneNumber || "N/A"}
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${getRoleBadgeClass(
                            displayRole,
                          )}`}
                        >
                          {displayRole}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={`${styles.btnAction} ${styles.edit}`}
                            title="Chỉnh sửa"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "20px" }}
                            >
                              edit
                            </span>
                          </button>
                          <button className={styles.btnAction} title="Thêm">
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "20px" }}
                            >
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className={styles.pagination}>
          <span className={styles.paginationText}>
            Hiển thị trang {page + 1} / {totalPages} (Tổng: {totalElements})
          </span>
          <div className={styles.paginationControls}>
            <button
              className={styles.btnPageNav}
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                chevron_left
              </span>
            </button>
            <div className={styles.pageNumbers}>
              <button className={`${styles.btnPageNum} ${styles.active}`}>
                {page + 1}
              </button>
            </div>
            <button
              className={styles.btnPageNav}
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
