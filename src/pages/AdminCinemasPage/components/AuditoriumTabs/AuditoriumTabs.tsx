import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './AuditoriumTabs.module.css';
import { cinemaService, AuditoriumDto } from '../../../../api/cinema.service';

interface AuditoriumTabsProps {
  cinemaId?: number;
  selectedAuditorium?: AuditoriumDto;
  onSelectAuditorium: (auditorium?: AuditoriumDto) => void;
}

const AuditoriumTabs: React.FC<AuditoriumTabsProps> = ({ cinemaId, selectedAuditorium, onSelectAuditorium }) => {
  const [auditoriums, setAuditoriums] = useState<AuditoriumDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAuditoriums = useCallback(async () => {
    if (!cinemaId) {
      setAuditoriums([]);
      return;
    }
    try {
      setLoading(true);
      const result = await cinemaService.searchAuditoriums({ cinemaId, page: 0, size: 99999 });
      const data = Array.isArray(result) ? result : (result?.data || []);
      setAuditoriums(data);
      if (data.length > 0 && !selectedAuditorium) {
        onSelectAuditorium(data[0]);
      } else if (data.length === 0) {
        onSelectAuditorium(undefined);
      }
    } catch (error) {
      console.error('Failed to fetch auditoriums', error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinemaId]);

  useEffect(() => {
    fetchAuditoriums();
  }, [fetchAuditoriums]);

  const handleCreateAuditorium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !cinemaId) return;

    try {
      setIsSubmitting(true);
      await cinemaService.createAuditorium({ name: newName, cinemaId });
      setIsModalOpen(false);
      setNewName('');
      fetchAuditoriums();
    } catch (error) {
      console.error('Failed to create auditorium', error);
      alert('Failed to create auditorium');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className="text-sm text-on-surface-variant p-2" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Loading auditoriums...</div>
      ) : (!cinemaId ? (
        <div className="text-sm text-on-surface-variant p-2" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Select a cinema to view auditoriums</div>
      ) : (auditoriums.length === 0 ? (
        <div className="text-sm text-on-surface-variant p-2" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>No auditoriums found.</div>
      ) : (
        auditoriums.map(auditorium => (
          <button 
            key={auditorium.id}
            className={selectedAuditorium?.id === auditorium.id ? styles.tabBtnActive : styles.tabBtn}
            onClick={() => onSelectAuditorium(auditorium)}
          >
            <span className={`material-symbols-outlined ${selectedAuditorium?.id === auditorium.id ? styles.iconActive : styles.icon}`}>meeting_room</span>
            <div>
              <p className={`${styles.label} ${selectedAuditorium?.id === auditorium.id ? styles.labelActive : ''}`}>{auditorium.name}</p>
              <p className={styles.subLabel}>Standard</p>
            </div>
          </button>
        ))
      )))}

      {cinemaId && (
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <span className={`material-symbols-outlined ${styles.addIcon}`}>add</span>
          <span className={styles.addText}>Add Auditorium</span>
        </button>
      )}
      {isModalOpen && createPortal(
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Create New Auditorium</h3>
            <form onSubmit={handleCreateAuditorium} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  required 
                  disabled={isSubmitting}
                  className={styles.input}
                  placeholder="e.g. Phòng chiếu 1"
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AuditoriumTabs;
