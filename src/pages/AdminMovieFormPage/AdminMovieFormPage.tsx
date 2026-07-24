import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AdminMovieFormPage.module.css";
import { MovieForm, MovieFormData } from "./components";
import { movieService } from "../../services/movie.service";
import { MovieStatus } from "../../types/movie";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../api/types";

const AdminMovieFormPage: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    description: "",
    genres: [],
    runtime: "",
    status: MovieStatus.DRAFT,
    isHighlighted: false,
    releaseDate: "",
    cast: [],
    poster: "",
    background: "",
    video: "",
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchMovie = async () => {
        setIsLoading(true);
        try {
          const movieIdInt = parseInt(id, 10);
          const [movie, crewMembers] = await Promise.all([
            movieService.getMovieById(movieIdInt),
            movieService.getMovieCrewMembers(movieIdInt).catch((err) => {
              console.error("Failed to load crew members", err);
              return [];
            }),
          ]);

          setFormData({
            title: movie.title || "",
            description: movie.description || "",
            genres: movie.genres || [],
            runtime: movie.runtime ? movie.runtime.toString() : "",
            status:
              (movie.status?.toUpperCase() as MovieStatus) ||
              MovieStatus.COMING_SOON,
            isHighlighted: movie.highlighted || false,
            releaseDate: movie.releaseDate || "",
            cast: crewMembers.map((cm) => ({
              ...cm,
              name: cm.name || "Unknown",
              avatar: cm.avatar,
            })),
            poster: movie.poster || "",
            background: movie.background || "",
            video: movie.video || "",
          });
        } catch (error) {
          console.error("Failed to load movie", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMovie();
    }
  }, [id, isEditMode]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      return toast.error("Vui lòng nhập tên phim.");
    }
    if (!formData.description.trim()) {
      return toast.error("Vui lòng nhập nội dung.");
    }
    if (formData.genres.length === 0) {
      return toast.error("Vui lòng chọn ít nhất một thể loại.");
    }
    if (!formData.runtime || parseInt(formData.runtime, 10) <= 0) {
      return toast.error("Vui lòng nhập thời lượng phim hợp lệ (lớn hơn 0).");
    }
    if (!formData.releaseDate) {
      return toast.error("Vui lòng chọn ngày phát hành.");
    }

    try {
      setIsSaving(true);
      const payload = {
        title: formData.title,
        tagline: "",
        description: formData.description,
        genres: formData.genres,
        runtime: parseInt(formData.runtime, 10) || 0,
        poster: formData.poster,
        background: formData.background,
        video: formData.video,
        releaseDate: formData.releaseDate,
        highlighted: formData.isHighlighted,
        status: formData.status,
      };

      if (isEditMode && id) {
        await movieService.updateMovie(parseInt(id, 10), payload);
        toast.success("Cập nhật phim thành công!");
      } else {
        const newMovie = await movieService.createMovie(payload);
        toast.success("Thêm phim mới thành công!");
        navigate(`/admin/movies/${newMovie.id}/edit`, { replace: true });
      }
    } catch (error) {
      console.error("Failed to save movie", error);
      toast.error(
        getApiErrorMessage(error, "Lưu phim thất bại. Vui lòng thử lại."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    navigate("/admin/movies");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <nav className={styles.breadcrumb}>
            <span onClick={() => navigate("/admin/movies")}>Phim</span>
            <span className="material-symbols-outlined">chevron_right</span>
            <span className={styles.currentCrumb}>
              {isEditMode ? "Chỉnh sửa phim" : "Thêm phim mới"}
            </span>
          </nav>
          <h2 className={styles.pageTitle}>
            {isEditMode ? "Chỉnh sửa phim" : "Thêm phim mới"}
          </h2>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.discardBtn} onClick={handleDiscard}>
            Hủy
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Tạo phim"}
          </button>
        </div>
      </div>

      {/* Main Form */}
      {isLoading ? (
        <p
          style={{ color: "var(--color-on-surface-variant)", padding: "2rem" }}
        >
          Đang tải dữ liệu phim...
        </p>
      ) : (
        <MovieForm
          formData={formData}
          setFormData={setFormData}
          movieId={id ? parseInt(id, 10) : undefined}
        />
      )}
    </div>
  );
};

export default AdminMovieFormPage;
