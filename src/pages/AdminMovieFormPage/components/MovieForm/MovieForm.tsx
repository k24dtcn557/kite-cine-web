import React, { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "../../../../api/types";
import { CrewMemberItem } from "../CrewMemberItem";
import styles from "./MovieForm.module.css";
import {
  movieService,
  MovieStatus,
  GENRE_LIST,
  MOVIE_STATUS_LABELS,
  CrewMemberDto,
} from "../../../../api/movie.service";
import { CrewMemberModal } from "../CrewMemberModal";

export interface MovieFormData {
  title: string;
  description: string;
  genres: string[];
  runtime: string;
  status: MovieStatus;
  isHighlighted: boolean;
  releaseDate: string;
  cast: CrewMemberDto[];
  poster: string;
  background: string;
  video: string;
}

interface MovieFormProps {
  formData: MovieFormData;
  setFormData: React.Dispatch<React.SetStateAction<MovieFormData>>;
  movieId?: number;
}

const MovieForm: React.FC<MovieFormProps> = ({
  formData,
  setFormData,
  movieId,
}) => {
  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{
    member: CrewMemberDto;
    index: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteCrewMember = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    const { member, index } = memberToDelete;

    if (member.id) {
      try {
        await movieService.deleteCrewMember(member.id);
        toast.success(`Đã xóa ${member.name} khỏi phim!`);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Lỗi khi xóa thành viên."));
        setIsDeleting(false);
        setMemberToDelete(null);
        return;
      }
    }

    const newCast = formData.cast.filter((_, i) => i !== index);
    setFormData({ ...formData, cast: newCast });
    setIsDeleting(false);
    setMemberToDelete(null);
  };

  const handleAddSuccess = (member: CrewMemberDto) => {
    setFormData({
      ...formData,
      cast: [...formData.cast, member],
    });
    setIsCrewModalOpen(false);
  };

  return (
    <div className={styles.grid}>
      {/* Left Column */}
      <div className={styles.leftCol}>
        {/* Basic Info */}
        <section className={`${styles.card} ${styles.glowRed}`}>
          <div className={styles.cardHeader}>
            <span
              className="material-symbols-outlined"
              style={{ color: "var(--color-primary)" }}
            >
              info
            </span>
            <h3>Thông tin cơ bản</h3>
          </div>

          <div className={styles.formGroup}>
            <label>Tên phim</label>
            <input
              type="text"
              placeholder="VD: Interstellar: The Lost Voyage"
              className={styles.inputTitle}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tóm tắt nội dung</label>
            <textarea
              rows={10}
              placeholder="Nhập tóm tắt nội dung phim..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Thể loại</label>
            <div className={styles.genreBox}>
              {GENRE_LIST.map((g) => {
                const isSelected = formData.genres.includes(g);
                return (
                  <span
                    key={g}
                    className={`${styles.genreChip} ${
                      isSelected ? styles.genreChipSelected : ""
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setFormData({
                          ...formData,
                          genres: formData.genres.filter(
                            (genre) => genre !== g,
                          ),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          genres: [...formData.genres, g],
                        });
                      }
                    }}
                  >
                    {g}
                  </span>
                );
              })}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Thời lượng</label>
            <div className={styles.inputWithSuffix} style={{ width: "130px" }}>
              <input
                type="number"
                placeholder="0"
                value={formData.runtime}
                onChange={(e) =>
                  setFormData({ ...formData, runtime: e.target.value })
                }
              />
              <span>phút</span>
            </div>
          </div>
        </section>

        {/* Media Upload */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span
              className="material-symbols-outlined"
              style={{ color: "var(--color-secondary)" }}
            >
              cloud_upload
            </span>
            <h3>Tải lên phương tiện</h3>
          </div>
          <div className={styles.twoCols}>
            <div className={styles.formGroup}>
              <label>Poster phim (2:3)</label>
              <div
                className={`${styles.uploadBox} ${styles.posterUpload}`}
                style={
                  formData.poster
                    ? {
                        backgroundImage: `url(${formData.poster})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "none",
                      }
                    : {}
                }
              >
                {!formData.poster && (
                  <>
                    <span className="material-symbols-outlined">
                      add_photo_alternate
                    </span>
                    <p>Chưa có ảnh</p>
                  </>
                )}
              </div>
              <input
                type="url"
                className={styles.input}
                placeholder="Nhập link ảnh (URL)..."
                value={formData.poster}
                onChange={(e) =>
                  setFormData({ ...formData, poster: e.target.value })
                }
                style={{ marginTop: "0.5rem" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div className={styles.formGroup}>
                <label>Ảnh nền (16:9)</label>
                <div
                  className={`${styles.uploadBox} ${styles.backdropUpload}`}
                  style={
                    formData.background
                      ? {
                          backgroundImage: `url(${formData.background})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          border: "none",
                        }
                      : {}
                  }
                >
                  {!formData.background && (
                    <span className="material-symbols-outlined">wallpaper</span>
                  )}
                </div>
                <input
                  type="url"
                  className={styles.input}
                  placeholder="Nhập link ảnh (URL)..."
                  value={formData.background}
                  onChange={(e) =>
                    setFormData({ ...formData, background: e.target.value })
                  }
                  style={{ marginTop: "0.5rem" }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Đường dẫn Trailer</label>
                <div className={styles.inputWithIcon}>
                  <span className="material-symbols-outlined">play_circle</span>
                  <input
                    type="url"
                    placeholder="https://youtube.com..."
                    value={formData.video}
                    onChange={(e) =>
                      setFormData({ ...formData, video: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cast & Crew */}
      </div>

      {/* Right Column */}
      <div className={styles.rightCol}>
        {/* Release Details */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span
              className="material-symbols-outlined"
              style={{ color: "var(--color-primary-fixed-dim)" }}
            >
              event
            </span>
            <h3>Thông tin phát hành</h3>
          </div>
          <div className={styles.formGroup}>
            <label>Ngày phát hành</label>
            <input
              type="date"
              value={formData.releaseDate}
              onChange={(e) =>
                setFormData({ ...formData, releaseDate: e.target.value })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label>Trạng thái</label>
            <div className={styles.radioGroup}>
              <label
                className={`${styles.radioLabel} ${formData.status === MovieStatus.COMING_SOON ? styles.radioLabelActive : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setFormData((prev) => ({
                    ...prev,
                    status: MovieStatus.COMING_SOON,
                  }));
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={MovieStatus.COMING_SOON}
                  checked={formData.status === MovieStatus.COMING_SOON}
                  readOnly
                />
                <span>{MOVIE_STATUS_LABELS[MovieStatus.COMING_SOON]}</span>
              </label>
              <label
                className={`${styles.radioLabel} ${formData.status === MovieStatus.NOW_SHOWING ? styles.radioLabelActive : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setFormData((prev) => ({
                    ...prev,
                    status: MovieStatus.NOW_SHOWING,
                  }));
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={MovieStatus.NOW_SHOWING}
                  checked={formData.status === MovieStatus.NOW_SHOWING}
                  readOnly
                />
                <span>{MOVIE_STATUS_LABELS[MovieStatus.NOW_SHOWING]}</span>
              </label>
              <label
                className={`${styles.radioLabel} ${formData.status === MovieStatus.DRAFT ? styles.radioLabelActive : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setFormData((prev) => ({
                    ...prev,
                    status: MovieStatus.DRAFT,
                  }));
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={MovieStatus.DRAFT}
                  checked={formData.status === MovieStatus.DRAFT}
                  readOnly
                />
                <span>{MOVIE_STATUS_LABELS[MovieStatus.DRAFT]}</span>
              </label>
              <label
                className={`${styles.radioLabel} ${formData.status === MovieStatus.ARCHIVED ? styles.radioLabelActive : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setFormData((prev) => ({
                    ...prev,
                    status: MovieStatus.ARCHIVED,
                  }));
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={MovieStatus.ARCHIVED}
                  checked={formData.status === MovieStatus.ARCHIVED}
                  readOnly
                />
                <span>{MOVIE_STATUS_LABELS[MovieStatus.ARCHIVED]}</span>
              </label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Nổi bật</label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isHighlighted}
                onChange={(e) =>
                  setFormData({ ...formData, isHighlighted: e.target.checked })
                }
              />
              <span>Đánh dấu phim này là nổi bật</span>
            </label>
          </div>
        </section>
        <section className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardHeader}>
              <span
                className="material-symbols-outlined"
                style={{ color: "var(--color-primary)" }}
              >
                groups
              </span>
              <h4>Đoàn phim</h4>
            </div>
            <button
              className={styles.addTextBtn}
              type="button"
              onClick={() => setIsCrewModalOpen(true)}
            >
              <span className="material-symbols-outlined">add_circle</span>
            </button>
          </div>

          <div className={styles.castGrid}>
            {formData.cast.map((c, i) => (
              <CrewMemberItem
                key={c.id || i}
                member={c}
                onDelete={() => setMemberToDelete({ member: c, index: i })}
              />
            ))}
          </div>
        </section>
      </div>

      <CrewMemberModal
        isOpen={isCrewModalOpen}
        onClose={() => setIsCrewModalOpen(false)}
        movieId={movieId}
        onAddSuccess={handleAddSuccess}
      />

      {memberToDelete &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{ maxWidth: "400px" }}>
              <h3>Xác nhận xóa</h3>
              <p
                style={{
                  margin: "1rem 0",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Bạn có chắc muốn xóa thành viên{" "}
                <strong>{memberToDelete.member.name}</strong> khỏi phim?
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setMemberToDelete(null)}
                  disabled={isDeleting}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className={styles.deleteConfirmBtn}
                  onClick={confirmDeleteCrewMember}
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

export default MovieForm;
