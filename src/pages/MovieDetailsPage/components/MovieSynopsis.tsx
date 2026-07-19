import React, { useState } from "react";
import styles from "./MovieSynopsis.module.css";
import {
  MovieDto,
  CrewMemberDto,
  CREW_ROLE_LABELS,
  CrewRole,
} from "../../../api/movie.service";
import { CommonUtils } from "../../../utils/CommonUtils";

interface Props {
  movie: MovieDto;
  crew: CrewMemberDto[];
}

const MovieSynopsis: React.FC<Props> = ({ movie, crew }) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const formattedDate = CommonUtils.formatDateVietnamese(movie.releaseDate);

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {/* Poster & CTAs */}
        <div className={styles.posterCol}>
          <div className={styles.posterWrapper}>
            <img
              src={
                movie.poster ||
                "https://placehold.co/600x900/1E1B1B/FFFFFF?text=No+Poster"
              }
              alt={`Official poster for ${movie.title}`}
              className={styles.posterImg}
              loading="lazy"
            />
          </div>

          <div className={styles.ctas}>
            <button
              className={styles.btnPrimary}
              onClick={() => {
                document
                  .getElementById("showtimes")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span className="material-symbols-outlined">
                confirmation_number
              </span>
              ĐẶT VÉ
            </button>
            <button
              className={styles.btnSecondary}
              onClick={() => {
                if (movie.video) setIsTrailerOpen(true);
              }}
              disabled={!movie.video}
            >
              <span className="material-symbols-outlined">play_circle</span>
              XEM TRAILER
            </button>
          </div>
        </div>

        {/* Info */}
        <div className={styles.contentCol}>
          <h1 className={styles.title}>{movie.title}</h1>

          <div className={styles.meta}>
            <span className={`${styles.genrePill} ${styles.genrePillPrimary}`}>
              {movie.genres?.[0]}
            </span>
            {movie.genres?.slice(1).map((genre: string) => (
              <span key={genre} className={styles.genrePill}>
                {genre}
              </span>
            ))}
          </div>

          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span
                className={`material-symbols-outlined ${styles.detailIcon}`}
              >
                calendar_month
              </span>
              <span>Công chiếu: {formattedDate}</span>
            </div>

            {movie.runtime > 0 && (
              <div className={styles.detailItem}>
                <span
                  className={`material-symbols-outlined ${styles.detailIcon}`}
                >
                  schedule
                </span>
                <span>
                  {CommonUtils.formatRuntimeVietnamese(movie.runtime)}
                </span>
              </div>
            )}
          </div>

          <h2 className={styles.heading}>Nội dung phim</h2>
          <p className={styles.synopsisText}>{movie.description}</p>

          {crew && crew.length > 0 && (
            <>
              <h2 className={styles.heading}>Diễn viên & Đoàn làm phim</h2>
              <div className={styles.crewGrid}>
                {crew.map((member, idx) => (
                  <div key={member.id || idx}>
                    <div className={styles.crewRole}>
                      {CREW_ROLE_LABELS[member.role as CrewRole] || member.role}
                    </div>
                    <div className={styles.crewName}>
                      {member.name || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {isTrailerOpen && movie.video && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsTrailerOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setIsTrailerOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className={styles.videoWrapper}>
              <iframe
                src={CommonUtils.getYouTubeEmbedUrl(movie.video)}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MovieSynopsis;
