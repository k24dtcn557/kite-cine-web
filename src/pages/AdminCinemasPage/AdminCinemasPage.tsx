import React, { useState } from "react";
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
            <SeatMap auditorium={selectedAuditorium} />

            <div className={styles.statsGrid}>
              <SeatLegend />
              <SeatControls />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminCinemasPage;
