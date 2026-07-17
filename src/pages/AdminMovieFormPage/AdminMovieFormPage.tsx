import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AdminMovieFormPage.module.css';
import { MovieForm, MovieFormData } from './components';

const AdminMovieFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    tagline: '',
    synopsis: '',
    genres: [],
    runtime: '',
    language: 'English',
    status: 'Coming Soon',
    releaseDate: '',
    contentRating: 'PG-13',
    metaTitle: '',
    metaDescription: '',
    cast: [
      { name: 'Christopher Nolan', role: 'Director' }
    ]
  });

  useEffect(() => {
    if (isEditMode) {
      // Simulate fetching movie data
      setFormData(prev => ({
        ...prev,
        title: id === '1' ? 'Neon Horizon' : 'Shadow Waltz',
        synopsis: 'A simulated fetch for edit mode.',
        genres: ['Sci-Fi', 'Drama'],
      }));
    }
  }, [id, isEditMode]);

  const handleSave = () => {
    // Simulate save
    navigate('/admin/movies');
  };

  const handleDiscard = () => {
    navigate('/admin/movies');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <nav className={styles.breadcrumb}>
            <span onClick={() => navigate('/admin/movies')}>Movies</span>
            <span className="material-symbols-outlined">chevron_right</span>
            <span className={styles.currentCrumb}>{isEditMode ? 'Edit Movie' : 'Add New Movie'}</span>
          </nav>
          <h2 className={styles.pageTitle}>{isEditMode ? 'Edit Movie' : 'Add New Movie'}</h2>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.discardBtn} onClick={handleDiscard}>Discard</button>
          <button className={styles.saveBtn} onClick={handleSave}>Save Movie</button>
        </div>
      </div>

      {/* Main Form */}
      <MovieForm formData={formData} setFormData={setFormData} />
    </div>
  );
};

export default AdminMovieFormPage;
