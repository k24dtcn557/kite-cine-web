import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TicketDetailPage.module.css";
import { QRCodeSVG } from "qrcode.react";

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, you would fetch ticket details by ID here.
  // We'll use mock data mirroring the UI requirements.
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setTicket({
        id: id || "CPX-9824-XT",
        movie: {
          title: "NEON HORIZON",
          format: "IMAX 2D",
          posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6YfkMis3O6j-Gd2wZF2Qwta9FDp5nyj4okJCKUU6HpwQtgybFYVKOM9ajHJU-rY4Y2Ix-QUjAxxfnm_AxTlDftwZ6zDdwzJcniUEnEdGf5bxUhKeugK0PrMt0y33cTbth63--TDW1iepcAGvWgJebz_E5ScG3anmvzEEYtKVglv-76GakcjZiBF9_iE-U_SEAeYAYj6ZxhRg_oxGlKdhTpumz6kk4yS45JQ60-4vvrOsywIyohQrk",
        },
        showtime: {
          date: "Oct 24, 2024",
          time: "8:30 PM",
        },
        theater: {
          name: "Cineplex Downtown",
          room: "Auditorium 9",
        },
        seats: ["A2", "A3"],
        seatType: "VIP Recliner",
        qrCode: "booking_id_cpx_9824_xt_secret_qr_data",
      });
    }, 500);
  }, [id]);

  if (!ticket) {
    return (
      <div className={styles.pageContainer}>
        <p>Loading ticket details...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumb / Back Navigation */}
      <div className={styles.breadcrumb}>
        <button
          className={styles.btnBack}
          onClick={() => navigate("/my-cine/tickets")}
        >
          <span className="material-symbols-outlined" style={{ marginRight: "0.25rem", fontSize: "1.125rem" }}>
            arrow_back
          </span>
          <span>Back to Tickets</span>
        </button>
      </div>

      {/* The Ticket Container */}
      <div className={styles.ticketContainer}>
        {/* Ticket Header */}
        <div className={styles.ticketHeader}>
          <div>
            <h2 className={styles.movieTitle}>{ticket.movie.title}</h2>
            <span className={styles.formatBadge}>{ticket.movie.format}</span>
          </div>
          <div className={styles.bookingIdSection}>
            <p className={styles.label}>Booking ID</p>
            <p className={styles.bookingIdValue}>{ticket.id}</p>
          </div>
        </div>

        {/* Ticket Body */}
        <div className={styles.ticketBody}>
          {/* Left Column (Poster) */}
          <div className={styles.posterColumn}>
            <div className={styles.posterWrapper}>
              <img
                src={ticket.movie.posterUrl}
                alt={ticket.movie.title}
                className={styles.posterImage}
              />
            </div>
          </div>

          {/* Perforation Line (Mobile) */}
          <div className={styles.perforationMobile}>
            <div className={styles.perforationCutoutLeft}></div>
            <div style={{ width: "100%", height: "2px", borderTop: "2px dashed var(--color-outline-variant)", opacity: 0.5 }}></div>
            <div className={styles.perforationCutoutRight}></div>
          </div>

          {/* Right Column (Details & QR) */}
          <div className={styles.detailsColumn}>
            {/* Show Info Grid */}
            <div className={styles.infoGrid}>
              <div>
                <p className={styles.label}>Date</p>
                <p className={styles.infoValue}>{ticket.showtime.date}</p>
              </div>
              <div>
                <p className={styles.label}>Time</p>
                <p className={styles.infoValue}>{ticket.showtime.time}</p>
              </div>

              <div className={styles.colSpan2}>
                <p className={styles.label}>Theater</p>
                <p className={styles.infoValue}>{ticket.theater.name}</p>
                <p className={styles.theaterSub}>{ticket.theater.room}</p>
              </div>

              <div className={styles.colSpan2}>
                <p className={styles.label}>Seats</p>
                <div className={styles.seatsWrapper}>
                  {ticket.seats.map((seat: string) => (
                    <span key={seat} className={styles.seatBadge}>
                      {seat}
                    </span>
                  ))}
                  <span className={styles.seatType}>{ticket.seatType}</span>
                </div>
              </div>

              {/* Mobile Booking ID */}
              <div className={styles.bookingIdMobile}>
                <p className={styles.label}>Booking ID</p>
                <p className={styles.bookingIdValue}>{ticket.id}</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className={styles.qrSection}>
              <p className={styles.qrLabel}>Scan at Entrance</p>
              <div className={styles.qrFrame}>
                <QRCodeSVG
                  value={ticket.qrCode}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.actionFooter}>
        <button className={styles.btnAction}>
          <span className="material-symbols-outlined">calendar_add_on</span>
          Add to Calendar
        </button>
        <button className={styles.btnAction}>
          <span className="material-symbols-outlined">download</span>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default TicketDetailPage;
