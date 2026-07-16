import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import styles from './SeatMap.module.css';
import { cinemaService, AuditoriumDto, SeatRowDto, SeatType } from '../../../../api/cinema.service';

interface SeatMapProps {
  auditorium?: AuditoriumDto;
}

const SeatMap: React.FC<SeatMapProps> = ({ auditorium }) => {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [seatRows, setSeatRows] = useState<SeatRowDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
  const [newRowLetter, setNewRowLetter] = useState('');
  const [newNumberOfSeats, setNewNumberOfSeats] = useState<number | ''>('');
  const [newSeatType, setNewSeatType] = useState<SeatType>('STANDARD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSeats = useCallback(async () => {
    if (!auditorium) {
      setSeatRows([]);
      return;
    }
    try {
      setLoading(true);
      const data = await cinemaService.getAuditoriumSeats(auditorium.id);
      setSeatRows(data || []);
    } catch (error) {
      console.error('Failed to fetch auditorium seats', error);
      setSeatRows([]);
    } finally {
      setLoading(false);
    }
  }, [auditorium]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  const handleAddRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditorium || !newRowLetter || !newNumberOfSeats) return;

    try {
      setIsSubmitting(true);
      await cinemaService.addRow({
        auditoriumId: auditorium.id,
        rowLetter: newRowLetter.toUpperCase(),
        numberOfSeats: Number(newNumberOfSeats),
        seatType: newSeatType,
      });
      setIsAddRowModalOpen(false);
      setNewRowLetter('');
      setNewNumberOfSeats('');
      setNewSeatType('STANDARD');
      fetchSeats(); // Refresh seats after adding
    } catch (error: any) {
      console.error('Failed to add row', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add row';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSeat = (id: string) => {
    setSelectedSeats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.container}>
      {/* Background Decor */}
      <div className={styles.glowDecor}></div>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{auditorium ? auditorium.name : 'Select an Auditorium'}</h3>
          <p className={styles.subtitle}>Interactive seat mapping and pricing tier allocation.</p>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.saveBtn} 
            onClick={() => auditorium && setIsAddRowModalOpen(true)}
            disabled={!auditorium}
          >
            <span className="material-symbols-outlined">add</span> Add Row
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className={styles.mapArea}>
        {/* Screen Projection */}
        <div className={styles.screenProjection}>
          <span className={styles.screenLabel}>IMAX PROJECTION SCREEN</span>
        </div>

        {/* Seat Grid */}
        <div className={styles.grid}>
          {loading ? (
            <div className="text-sm text-on-surface-variant p-2" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Loading seats...</div>
          ) : seatRows.length === 0 ? (
            <div className="text-sm text-on-surface-variant p-2" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
              {auditorium ? 'No seats configured for this auditorium.' : 'Please select an auditorium to view seats.'}
            </div>
          ) : (
            seatRows.map((row) => (
              <React.Fragment key={row.rowLetter}>
                <div className={styles.rowLabel}>{row.rowLetter}</div>
                <div className={styles.seatRow}>
                  {row.seats.map((seat) => {
                    const id = `${seat.rowLetter}${seat.seatNumber}`;
                    const isVip = seat.seatType?.toUpperCase() === 'VIP';
                    // We don't have isAcc in the backend model currently, 
                    // so let's rely on seatType if it exists or keep it simple.
                    const isAcc = seat.seatType?.toUpperCase() === 'ACC' || seat.seatType?.toUpperCase() === 'COUPLE';
                    const isSelected = selectedSeats.has(id);

                    let seatClass = styles.seatRegular;
                    if (isVip) seatClass = styles.seatVip;
                    else if (isAcc) seatClass = styles.seatAcc;

                    return (
                      <div 
                        key={id}
                        className={`${styles.seat} ${seatClass} ${isSelected ? styles.seatSelected : ''}`}
                        onClick={() => toggleSeat(id)}
                        title={`Seat ${id} (${seat.seatType || 'Standard'})`}
                      >
                        <span className={styles.seatNumber}>{seat.seatNumber}</span>
                        {isVip && (
                          <span className={`material-symbols-outlined ${styles.vipStar}`}>star</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {isAddRowModalOpen && createPortal(
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Add Row</h3>
            <form onSubmit={handleAddRow} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Row Letter</label>
                <input 
                  type="text" 
                  value={newRowLetter} 
                  onChange={(e) => setNewRowLetter(e.target.value)} 
                  required 
                  maxLength={2}
                  disabled={isSubmitting}
                  className={styles.input}
                  placeholder="e.g. A"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Number of Seats</label>
                <input 
                  type="number" 
                  value={newNumberOfSeats} 
                  onChange={(e) => setNewNumberOfSeats(e.target.value === '' ? '' : Number(e.target.value))} 
                  required 
                  min={1}
                  max={50}
                  disabled={isSubmitting}
                  className={styles.input}
                  placeholder="e.g. 10"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Seat Type</label>
                <select 
                  value={newSeatType} 
                  onChange={(e) => setNewSeatType(e.target.value as SeatType)} 
                  required 
                  disabled={isSubmitting}
                  className={styles.input}
                >
                  <option value="STANDARD">STANDARD</option>
                  <option value="VIP">VIP</option>
                  <option value="COUPLE">COUPLE</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsAddRowModalOpen(false)} disabled={isSubmitting} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                  {isSubmitting ? 'Adding...' : 'Add Row'}
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

export default SeatMap;
