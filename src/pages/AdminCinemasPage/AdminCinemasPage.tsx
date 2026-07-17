import React, { useState, useCallback } from "react";
import styles from "./AdminCinemasPage.module.css";
import {
  CinemaList,
  AuditoriumTabs,
  SeatMap,
  SeatLegend,
  SeatControls,
} from "./components";
import { AuditoriumDto } from "../../api/cinema.service";

const AdminCinemasPage: React.FC = () => {
  const [selectedCinemaId, setSelectedCinemaId] = useState<
    number | undefined
  >();
  const [selectedAuditorium, setSelectedAuditorium] = useState<
    AuditoriumDto | undefined
  >();
  const [openAddRowModal, setOpenAddRowModal] = useState<(() => void) | null>(
    null,
  );
  const [openAddSeatModal, setOpenAddSeatModal] = useState<(() => void) | null>(
    null,
  );
  const [openDeleteSeatsModal, setOpenDeleteSeatsModal] = useState<
    (() => void) | null
  >(null);
  const [openChangeSeatTypeModal, setOpenChangeSeatTypeModal] = useState<
    (() => void) | null
  >(null);
  const [clearSelection, setClearSelection] = useState<(() => void) | null>(
    null,
  );
  const [openSelectRowModal, setOpenSelectRowModal] = useState<
    (() => void) | null
  >(null);

  const handleOpenAddRowModal = useCallback(
    (fn: () => void) => setOpenAddRowModal(() => fn),
    [],
  );
  const handleOpenAddSeatModal = useCallback(
    (fn: () => void) => setOpenAddSeatModal(() => fn),
    [],
  );
  const handleOpenDeleteSeatsModal = useCallback(
    (fn: () => void) => setOpenDeleteSeatsModal(() => fn),
    [],
  );
  const handleOpenChangeSeatTypeModal = useCallback(
    (fn: () => void) => setOpenChangeSeatTypeModal(() => fn),
    [],
  );
  const handleClearSelectionBridge = useCallback(
    (fn: () => void) => setClearSelection(() => fn),
    [],
  );
  const handleOpenSelectRowModal = useCallback(
    (fn: () => void) => setOpenSelectRowModal(() => fn),
    [],
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainGrid}>
        {/* Level 1: Cinema List (Left Column) */}
        <section className={styles.leftCol}>
          <CinemaList
            selectedCinemaId={selectedCinemaId}
            onSelectCinema={(id) => {
              setSelectedCinemaId(id);
              setSelectedAuditorium(undefined);
            }}
          />
        </section>

        {/* Level 2 & 3: Auditorium and Seat Config (Right Column) */}
        <section className={styles.rightCol}>
          {/* AuditoriumTabs stays fixed at top */}
          <AuditoriumTabs
            cinemaId={selectedCinemaId}
            selectedAuditorium={selectedAuditorium}
            onSelectAuditorium={setSelectedAuditorium}
          />

          {/* Scrollable area: SeatMap + stats + bulk actions */}
          <div className={styles.seatMapScroll}>
            <SeatMap
              auditorium={selectedAuditorium}
              openAddRowModal={handleOpenAddRowModal}
              openAddSeatModal={handleOpenAddSeatModal}
              openDeleteSeatsModal={handleOpenDeleteSeatsModal}
              openChangeSeatTypeModal={handleOpenChangeSeatTypeModal}
              clearSelectionBridge={handleClearSelectionBridge}
              openSelectRowModal={handleOpenSelectRowModal}
            />

            <div className={styles.statsGrid}>
              <SeatLegend />
              <SeatControls
                hasAuditorium={!!selectedAuditorium}
                onAddRow={() => openAddRowModal?.()}
                onAddSeat={() => openAddSeatModal?.()}
                onDeleteSeats={() => openDeleteSeatsModal?.()}
                onChangeSeatType={() => openChangeSeatTypeModal?.()}
                onClearSelection={() => clearSelection?.()}
                onSelectRow={() => openSelectRowModal?.()}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminCinemasPage;
