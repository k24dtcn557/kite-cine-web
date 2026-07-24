import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./AdminPriceModelPage.module.css";
import { PriceModelComponent } from "../../components";
import PriceModelModal from "./components/PriceModelModal";
import { priceModelService } from "../../services/price-model.service";
import { PriceModelDto, PRICE_MODEL_SEAT_TYPES } from "../../types/showtime";
import toast from "react-hot-toast";

const AdminPriceModelPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<PriceModelDto | undefined>(
    undefined,
  );
  const [models, setModels] = useState<PriceModelDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingModelId, setDeletingModelId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setCurrentPage(0); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchPriceModels = async () => {
    setLoading(true);
    try {
      const result = await priceModelService.searchPriceModels({
        keyword: debouncedKeyword,
        page: currentPage,
        size: 9,
      });
      setModels(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch price models", error);
      toast.error("Không thể tải danh sách bảng giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, currentPage]);

  const handleEdit = (id: string) => {
    const modelToEdit = models.find((m) => m.id === id);
    if (modelToEdit) {
      setEditingModel(modelToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingModelId(id);
  };

  const confirmDeletePriceModel = async () => {
    if (!deletingModelId) return;

    setIsDeleting(true);
    try {
      await priceModelService.deletePriceModel(deletingModelId);
      toast.success("Xóa bảng giá thành công!");
      setDeletingModelId(null);
      fetchPriceModels(); // Refresh list after deletion
    } catch (error: any) {
      console.error("Failed to delete price model", error);
      toast.error(error?.response?.data?.message || "Lỗi khi xóa bảng giá");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreate = () => {
    setEditingModel(undefined);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchPriceModels();
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.headerContainer}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Quản lý bảng giá</h2>
        </div>
        <button className={styles.createBtn} onClick={handleCreate}>
          <span className="material-symbols-outlined">add</span>
          Tạo bảng giá mới
        </button>
      </div>

      {/* Filters & Pagination */}
      <div className={styles.filtersRow}>
        <div className={styles.searchContainer}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>
            search
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm kiếm bảng giá..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={loading || currentPage === 0}
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className={styles.pageInfo}>
            Trang {currentPage + 1} / {Math.max(1, totalPages)}
          </span>
          <button
            className={styles.pageBtn}
            disabled={loading || currentPage >= Math.max(0, totalPages - 1)}
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(Math.max(0, totalPages - 1), p + 1),
              )
            }
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Bento Grid of Price Models */}
      <div className={styles.grid}>
        {loading ? (
          <div className={styles.loadingState} style={{ gridColumn: "1 / -1" }}>
            <span className={`material-symbols-outlined ${styles.spinner}`}>
              sync
            </span>
            <p>Đang tải bảng giá...</p>
          </div>
        ) : models.length > 0 ? (
          models.map((model) => {
            const tiersArray = PRICE_MODEL_SEAT_TYPES.map(
              ({ type, label }) => ({
                name: label,
                price: model.prices[type] || 0,
              }),
            );

            return (
              <PriceModelComponent
                key={model.id}
                title={model.name}
                icon="local_activity" // Fallback icon since API doesn't provide one
                tiers={tiersArray}
                onEdit={() => handleEdit(model.id)}
                onDelete={() => handleDelete(model.id)}
              />
            );
          })
        ) : (
          <div className={styles.emptyState} style={{ gridColumn: "1 / -1" }}>
            <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
              request_quote
            </span>
            <p className={styles.emptyText}>Không tìm thấy bảng giá nào.</p>
            <p className={styles.emptySubtext}>
              Vui lòng thử thay đổi từ khóa hoặc tạo mới.
            </p>
          </div>
        )}
      </div>

      <PriceModelModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingModel(undefined);
        }}
        onSuccess={handleModalSuccess}
        initialData={editingModel}
      />

      {deletingModelId &&
        createPortal(
          <div
            className={styles.modalOverlay}
            onClick={() => !isDeleting && setDeletingModelId(null)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Xác nhận xóa</h3>
              <p
                style={{
                  margin: "1rem 0",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Bạn có chắc chắn muốn xóa bảng giá này không?
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setDeletingModelId(null)}
                  disabled={isDeleting}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className={styles.deleteConfirmBtn}
                  onClick={confirmDeletePriceModel}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default AdminPriceModelPage;
