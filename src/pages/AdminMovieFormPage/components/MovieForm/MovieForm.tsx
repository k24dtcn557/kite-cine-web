import React from 'react';
import styles from './MovieForm.module.css';

export interface MovieFormData {
  title: string;
  tagline: string;
  synopsis: string;
  genres: string[];
  runtime: string;
  language: string;
  status: string;
  releaseDate: string;
  contentRating: string;
  metaTitle: string;
  metaDescription: string;
  cast: { name: string; role: string }[];
}

interface MovieFormProps {
  formData: MovieFormData;
  setFormData: React.Dispatch<React.SetStateAction<MovieFormData>>;
}

const MovieForm: React.FC<MovieFormProps> = ({ formData, setFormData }) => {
  return (
    <div className={styles.grid}>
      {/* Left Column */}
      <div className={styles.leftCol}>
        {/* Basic Info */}
        <section className={`${styles.card} ${styles.glowRed}`}>
          <div className={styles.cardHeader}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>info</span>
            <h3>Basic Information</h3>
          </div>
          
          <div className={styles.formGroup}>
            <label>Movie Title</label>
            <input 
              type="text" 
              placeholder="e.g. Interstellar: The Lost Voyage" 
              className={styles.inputTitle}
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tagline</label>
            <input 
              type="text" 
              placeholder="Humanity was born on Earth..."
              className={styles.inputItalic}
              value={formData.tagline}
              onChange={e => setFormData({...formData, tagline: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Synopsis</label>
            <textarea 
              rows={4} 
              placeholder="Enter a compelling summary..."
              value={formData.synopsis}
              onChange={e => setFormData({...formData, synopsis: e.target.value})}
            ></textarea>
          </div>

          <div className={styles.twoCols}>
            <div className={styles.formGroup}>
              <label>Genre</label>
              <div className={styles.genreBox}>
                {formData.genres.map(g => (
                  <span key={g} className={styles.genreChip}>
                    {g} <span className="material-symbols-outlined">close</span>
                  </span>
                ))}
                <button className={styles.addGenreBtn}>+ Add Genre</button>
              </div>
            </div>
            <div className={styles.twoColsInner}>
              <div className={styles.formGroup}>
                <label>Runtime</label>
                <div className={styles.inputWithSuffix}>
                  <input type="number" placeholder="169" value={formData.runtime} onChange={e => setFormData({...formData, runtime: e.target.value})} />
                  <span>min</span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Language</label>
                <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>Japanese</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Media Upload */}
        <section className={styles.card}>
           <div className={styles.cardHeader}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)' }}>cloud_upload</span>
            <h3>Media Upload</h3>
          </div>
          <div className={styles.twoCols}>
            <div className={styles.formGroup}>
              <label>Movie Poster (2:3)</label>
              <div className={`${styles.uploadBox} ${styles.posterUpload}`}>
                 <span className="material-symbols-outlined">add_photo_alternate</span>
                 <p>Drag and drop or click to upload</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className={styles.formGroup}>
                <label>Backdrop Image (16:9)</label>
                <div className={`${styles.uploadBox} ${styles.backdropUpload}`}>
                  <span className="material-symbols-outlined">wallpaper</span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Trailer URL</label>
                <div className={styles.inputWithIcon}>
                  <span className="material-symbols-outlined">play_circle</span>
                  <input type="url" placeholder="https://youtube.com..." />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cast & Crew */}
        <section className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardHeader}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-on-tertiary-container)' }}>groups</span>
              <h3>Cast & Crew</h3>
            </div>
            <button className={styles.addTextBtn}>
              <span className="material-symbols-outlined">add_circle</span> Add Person
            </button>
          </div>
          
          <div className={styles.castGrid}>
            {formData.cast.map((c, i) => (
              <div key={i} className={styles.castItem}>
                <div className={styles.castAvatar}>
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className={styles.castInfo}>
                  <input type="text" value={c.name} onChange={()=>{}} className={styles.castName} placeholder="Name" />
                  <input type="text" value={c.role} onChange={()=>{}} className={styles.castRole} placeholder="Role" />
                </div>
                <button className={styles.deleteCastBtn}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Right Column */}
      <div className={styles.rightCol}>
        {/* Release Details */}
        <section className={styles.card}>
           <div className={styles.cardHeader}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-fixed-dim)' }}>event</span>
            <h3>Release Details</h3>
          </div>
          <div className={styles.formGroup}>
            <label>Release Date</label>
            <input type="date" value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label>Status</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input type="radio" name="status" value="Coming Soon" checked={formData.status === 'Coming Soon'} onChange={e => setFormData({...formData, status: e.target.value})} />
                Coming Soon
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="status" value="Now Showing" checked={formData.status === 'Now Showing'} onChange={e => setFormData({...formData, status: e.target.value})} />
                Now Showing
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="status" value="Draft" checked={formData.status === 'Draft'} onChange={e => setFormData({...formData, status: e.target.value})} />
                Draft
              </label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Content Rating</label>
            <div className={styles.ratingGroup}>
              {['G', 'PG', 'PG-13', 'R'].map(rating => (
                <button 
                  key={rating}
                  className={`${styles.ratingBtn} ${formData.contentRating === rating ? styles.ratingBtnActive : ''}`}
                  onClick={() => setFormData({...formData, contentRating: rating})}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SEO & Metadata */}
        <section className={`${styles.card} ${styles.glowBlue}`}>
           <div className={styles.cardHeader}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)' }}>search_check</span>
            <h3>SEO & Metadata</h3>
          </div>
          <div className={styles.formGroup}>
            <label>Meta Title</label>
            <input type="text" placeholder="SEO optimized title..." value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label>Meta Description</label>
            <textarea rows={3} placeholder="Enter meta description..." value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})}></textarea>
          </div>
          <div className={styles.seoPreview}>
            <p className={styles.seoPreviewLabel}>Search Preview</p>
            <p className={styles.seoPreviewTitle}>{formData.metaTitle || 'Movie Title'} | CineAdmin Booking</p>
            <p className={styles.seoPreviewUrl}>https://cineadmin.com/movie/...</p>
            <p className={styles.seoPreviewDesc}>{formData.metaDescription || 'Humanity was born on Earth. It was never meant to die here...'}</p>
          </div>
        </section>

        {/* Publishing Tips */}
        <div className={styles.tipsBox}>
          <h4><span className="material-symbols-outlined">help_outline</span> Publishing Tips</h4>
          <ul>
            <li>High-quality posters improve click-rates by 40%.</li>
            <li>Include at least 3 main cast members for better SEO.</li>
            <li>Synopsis should be between 200-500 characters.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
