import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./AdminUsersPage.module.css";
import {
  managementService,
  CreateUserPayload,
} from "../../api/management.service";
import { UserDto, UserStatusText } from "../../api/auth.service";
import toast from "react-hot-toast";
import UserInfoForm from "../../components/UserInfoForm";
import { getApiErrorMessage } from "../../api/types";
import CreateUserForm from "../../components/CreateUserForm";

const getRoleDisplayName = (role?: string) => {
  if (!role) return "Người dùng";
  const upperRole = role.toUpperCase();
  if (upperRole.includes("ADMIN")) return "Quản trị viên";
  return "Người dùng";
};

const getRoleBadgeClass = (displayRole: string) => {
  switch (displayRole) {
    case "Quản trị viên":
      return styles.badgeAdmin;
    case "Người dùng":
      return styles.badgeStandard;
    default:
      return styles.badgeStandard;
  }
};

const AdminUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");

  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState<UserDto | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
  const [menuCoords, setMenuCoords] = useState<{
    top?: number;
    bottom?: number;
    right: number;
  } | null>(null);

  const [confirmAction, setConfirmAction] = useState<
    "LOCK" | "ACTIVATE" | "DELETE" | "RESET_PASSWORD" | null
  >(null);
  const [confirmUser, setConfirmUser] = useState<UserDto | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const openConfirmDialog = (
    action: "LOCK" | "ACTIVATE" | "DELETE" | "RESET_PASSWORD",
    user: UserDto,
  ) => {
    setConfirmAction(action);
    setConfirmUser(user);
    setActiveMenuUserId(null);
    setMenuCoords(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmUser || !confirmAction) return;
    setIsConfirmLoading(true);
    try {
      if (confirmAction === "LOCK") {
        await managementService.lockUser(confirmUser.id);
        toast.success("Khóa người dùng thành công!");
      } else if (confirmAction === "ACTIVATE") {
        await managementService.activateUser(confirmUser.id);
        toast.success("Kích hoạt người dùng thành công!");
      } else if (confirmAction === "DELETE") {
        await managementService.deleteUser(confirmUser.id);
        toast.success("Xóa người dùng thành công!");
      } else if (confirmAction === "RESET_PASSWORD") {
        await managementService.resetPassword(confirmUser.id);
        toast.success("Đặt lại mật khẩu thành công!");
      }

      const payload = {
        keyword: searchQuery || undefined,
        status: getBackendStatus(selectedStatus),
        page: page,
        size: 10,
      };
      const response = await managementService.searchUsers(payload);
      setUsers(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);

      setConfirmAction(null);
      setConfirmUser(null);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Thao tác thất bại, vui lòng thử lại."),
      );
    } finally {
      setIsConfirmLoading(false);
    }
  };

  useEffect(() => {
    const handleCloseMenu = () => {
      setActiveMenuUserId(null);
      setMenuCoords(null);
    };
    document.addEventListener("click", handleCloseMenu);
    document.addEventListener("scroll", handleCloseMenu, true);
    return () => {
      document.removeEventListener("click", handleCloseMenu);
      document.removeEventListener("scroll", handleCloseMenu, true);
    };
  }, []);

  // We map display names to backend statuses if necessary, or pass empty for "All Statuses"
  const getBackendStatus = (displayStatus: string) => {
    switch (displayStatus) {
      case "Hoạt động":
        return "ACTIVE";
      case "Khóa":
        return "LOCKED";
      case "Đã xóa":
        return "DELETED";
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
          status: getBackendStatus(selectedStatus),
          page: page,
          size: 10,
        };
        const response = await managementService.searchUsers(payload);
        setUsers(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotalElements(response.totalElements || 0);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error(
          getApiErrorMessage(error, "Không thể tải danh sách người dùng."),
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Simple debounce logic for search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedStatus, page, refreshKey]);

  const handleEditUser = async (id: string) => {
    setSelectedUserId(id);
    setModalUser(null);
    setIsModalOpen(true);
    setIsModalLoading(true);
    try {
      const user = await managementService.getUser(id);
      setModalUser(user);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Không thể tải thông tin người dùng."),
      );
      setIsModalOpen(false);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCreateUser = async (payload: CreateUserPayload) => {
    setIsCreatingUser(true);
    try {
      await managementService.createUser(payload);
      toast.success("Tạo người dùng thành công!");
      setIsCreateModalOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Tạo người dùng thất bại. Vui lòng thử lại."),
      );
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleUpdateUser = async (payload: any) => {
    if (!selectedUserId) return;
    setIsUpdatingUser(true);
    try {
      await managementService.updateUser(selectedUserId, payload);
      toast.success("Cập nhật thông tin thành công!");
      const user = await managementService.getUser(selectedUserId);
      setModalUser(user);
      setRefreshKey((prev) => prev + 1);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Cập nhật thất bại. Vui lòng thử lại."),
      );
    } finally {
      setIsUpdatingUser(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.pageTitle}>Quản lý người dùng</h2>
        </div>
        <button
          className={styles.btnAddUser}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <span className="material-symbols-outlined">person_add</span>
          Thêm người dùng
        </button>
      </div>

      {/* Filter Bar */}
      <div className={`${styles.glassPanel} ${styles.filterBar}`}>
        {/* Search Input */}
        <div className={styles.searchContainer}>
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
            <span className={styles.roleLabel}>Trạng thái:</span>
            <div className={styles.selectWrapper}>
              <select
                className={styles.roleSelect}
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(0); // reset page on filter
                }}
              >
                <option>Tất cả trạng thái</option>
                <option>Hoạt động</option>
                <option>Khóa</option>
                <option>Đã xóa</option>
              </select>
              <span
                className={`material-symbols-outlined ${styles.selectIcon}`}
              >
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Table Container */}
      <div className={`${styles.glassPanel} ${styles.tableContainer}`}>
        <div className={styles.tableScroll}>
          <table className={styles.userTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th style={{ width: "30%" }}>Tên</th>
                <th style={{ width: "30%" }}>Tên đăng nhập</th>
                <th style={{ width: "15%" }}>Trạng thái</th>
                <th style={{ width: "15%" }}>Vai trò</th>
                <th style={{ width: "10%" }} className={styles.alignRight}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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
                      <td>
                        <span
                          className={`${styles.badge} ${
                            user.status === "LOCKED" ||
                            user.status === "DELETED"
                              ? styles.badgeInactive
                              : styles.badgeActive
                          }`}
                        >
                          {UserStatusText[user.status as string] || "Hoạt động"}
                        </span>
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
                          <div style={{ position: "relative" }}>
                            <button
                              className={styles.btnAction}
                              title="Tùy chọn"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (activeMenuUserId === user.id) {
                                  setActiveMenuUserId(null);
                                  setMenuCoords(null);
                                } else {
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  const spaceBelow =
                                    window.innerHeight - rect.bottom;
                                  const showAbove = spaceBelow < 250;
                                  setMenuCoords({
                                    ...(showAbove
                                      ? {
                                          bottom:
                                            window.innerHeight - rect.top + 8,
                                        }
                                      : { top: rect.bottom + 8 }),
                                    right: window.innerWidth - rect.right,
                                  });
                                  setActiveMenuUserId(user.id);
                                }
                              }}
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: "20px" }}
                              >
                                more_vert
                              </span>
                            </button>

                            {activeMenuUserId === user.id &&
                              menuCoords &&
                              createPortal(
                                <div
                                  className={styles.dropdownMenu}
                                  style={{
                                    position: "fixed",
                                    top: menuCoords.top,
                                    bottom: menuCoords.bottom,
                                    right: menuCoords.right,
                                  }}
                                >
                                  <button
                                    className={styles.dropdownItem}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuUserId(null);
                                      setMenuCoords(null);
                                      handleEditUser(user.id);
                                    }}
                                  >
                                    <span className="material-symbols-outlined">
                                      edit
                                    </span>
                                    Cập nhật
                                  </button>
                                  {user.status === "ACTIVE" && (
                                    <button
                                      className={styles.dropdownItem}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openConfirmDialog("LOCK", user);
                                      }}
                                    >
                                      <span className="material-symbols-outlined">
                                        lock
                                      </span>
                                      Khóa
                                    </button>
                                  )}
                                  {user.status === "LOCKED" && (
                                    <button
                                      className={styles.dropdownItem}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openConfirmDialog("ACTIVATE", user);
                                      }}
                                    >
                                      <span className="material-symbols-outlined">
                                        lock_open
                                      </span>
                                      Kích hoạt
                                    </button>
                                  )}
                                  {user.status !== "DELETED" && (
                                    <button
                                      className={styles.dropdownItem}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openConfirmDialog(
                                          "RESET_PASSWORD",
                                          user,
                                        );
                                      }}
                                    >
                                      <span className="material-symbols-outlined">
                                        key
                                      </span>
                                      Đặt lại mật khẩu
                                    </button>
                                  )}
                                  {user.status !== "DELETED" && (
                                    <button
                                      className={`${styles.dropdownItem} ${styles.danger}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openConfirmDialog("DELETE", user);
                                      }}
                                    >
                                      <span className="material-symbols-outlined">
                                        delete
                                      </span>
                                      Xóa tài khoản
                                    </button>
                                  )}
                                </div>,
                                document.body,
                              )}
                          </div>
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

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Tạo người dùng mới</h3>
              <button
                className={styles.btnClose}
                onClick={() => setIsCreateModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className={styles.modalBody}>
              <CreateUserForm
                onSubmit={handleCreateUser}
                isUpdating={isCreatingUser}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>
                Thông tin người dùng{" "}
                {modalUser?.username ? `- ${modalUser.username}` : ""}
              </h3>
              <button
                className={styles.btnClose}
                onClick={() => setIsModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className={styles.modalBody}>
              <UserInfoForm
                initialData={modalUser}
                onSubmit={handleUpdateUser}
                isUpdating={isModalLoading || isUpdatingUser}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {confirmAction && confirmUser && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isConfirmLoading && setConfirmAction(null)}
        >
          <div
            className={styles.modalContent}
            style={{ maxWidth: "450px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Xác nhận thao tác</h3>
              <button
                className={styles.btnClose}
                onClick={() => !isConfirmLoading && setConfirmAction(null)}
                disabled={isConfirmLoading}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p
                style={{
                  margin: 0,
                  marginBottom: "2rem",
                  lineHeight: "1.5",
                  color: "var(--color-on-surface)",
                }}
              >
                Bạn có chắc chắn muốn{" "}
                {confirmAction === "LOCK"
                  ? "khóa"
                  : confirmAction === "ACTIVATE"
                    ? "kích hoạt"
                    : confirmAction === "RESET_PASSWORD"
                      ? "đặt lại mật khẩu"
                      : "xóa"}{" "}
                tài khoản <strong>{confirmUser.username}</strong> -{" "}
                <strong>{confirmUser.fullName}</strong> không?
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setConfirmAction(null)}
                  disabled={isConfirmLoading}
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.875rem",
                    borderRadius: "8px",
                    border: "1px solid var(--color-outline-variant)",
                    background: "transparent",
                    color: "var(--color-on-surface)",
                    cursor: isConfirmLoading ? "not-allowed" : "pointer",
                    fontWeight: 500,
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={isConfirmLoading}
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.875rem",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor:
                      confirmAction === "DELETE"
                        ? "var(--color-error)"
                        : "var(--color-primary)",
                    color:
                      confirmAction === "DELETE"
                        ? "white"
                        : "var(--color-on-primary)",
                    cursor: isConfirmLoading ? "not-allowed" : "pointer",
                    fontWeight: 500,
                  }}
                >
                  {isConfirmLoading ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
