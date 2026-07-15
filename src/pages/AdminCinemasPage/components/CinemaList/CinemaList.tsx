import React, { useEffect, useState } from 'react';
import styles from './CinemaList.module.css';
import { cinemaService } from '../../../../api/cinema.service';

interface CinemaListProps {
  selectedCinemaId?: number;
  onSelectCinema?: (id: number) => void;
}

const CinemaList: React.FC<CinemaListProps> = ({ selectedCinemaId, onSelectCinema }) => {
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCinemas = async () => {
    try {
      const result = await cinemaService.search({ page: 0, size: 999999 });
      // Depending on backend pagination response, it might be in content, data, or direct array
      const data = Array.isArray(result) ? result : (result?.data || result?.data || []);
      setCinemas(data);
    } catch (error) {
      console.error('Failed to fetch cinemas', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  const handleCreateCinema = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) return;
    
    try {
      setIsSubmitting(true);
      await cinemaService.create({ name: newName, address: newAddress });
      setIsModalOpen(false);
      setNewName('');
      setNewAddress('');
      fetchCinemas();
    } catch (error) {
      console.error('Failed to create cinema', error);
      alert('Failed to create cinema');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Cinemas</h3>
        <button className={styles.addBtn} aria-label="Add Cinema" onClick={() => setIsModalOpen(true)}>
          <span className="material-symbols-outlined">add_circle</span>
        </button>
      </div>

      <div className={`${styles.list} custom-scrollbar`}>
        {loading ? (
          <p className="text-sm text-on-surface-variant p-4">Loading cinemas...</p>
        ) : cinemas.length === 0 ? (
          <p className="text-sm text-on-surface-variant p-4">No cinemas found.</p>
        ) : (
          cinemas.map((cinema, index) => (
            <div 
              key={cinema.id || index} 
              className={selectedCinemaId === cinema.id ? styles.cardActive : styles.cardInactive}
              onClick={() => onSelectCinema && onSelectCinema(cinema.id)}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{cinema.name}</span>
                <span className={`material-symbols-outlined ${styles.moreIcon}`}>more_vert</span>
              </div>
              
              {cinema.address && (
                <p className={styles.address}>
                  <span className={`material-symbols-outlined ${styles.addressIcon}`}>map</span> 
                  {cinema.address}
                </p>
              )}
              
              <div className={styles.tags}>
                <span className={styles.tagScreen}>{cinema.screens || 1} Screens</span>
                {cinema.vip && <span className={styles.tagVip}>VIP Hub</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Create New Cinema</h3>
            <form onSubmit={handleCreateCinema} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  required 
                  disabled={isSubmitting}
                  className={styles.input}
                  placeholder="e.g. Rạp Thăng Long"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Address</label>
                <input 
                  type="text" 
                  value={newAddress} 
                  onChange={(e) => setNewAddress(e.target.value)} 
                  required 
                  disabled={isSubmitting}
                  className={styles.input}
                  placeholder="e.g. Tầng 3, VinCom"
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
        </div>
      )}
    </div>
  );
};

export default CinemaList;
