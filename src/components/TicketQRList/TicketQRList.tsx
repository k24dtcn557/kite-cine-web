import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { PRICE_MODEL_SEAT_TYPES } from "../../api/price-model.service";
import { TicketDto } from "../../api/ticket.service";
import styles from "./TicketQRList.module.css";

const getSeatTypeLabel = (type: string) =>
  PRICE_MODEL_SEAT_TYPES.find((t) => t.type === type)?.label || type;

interface TicketQRListProps {
  tickets: TicketDto[];
  title?: string;
  subtitle?: string;
}

const TicketQRList: React.FC<TicketQRListProps> = ({
  tickets,
  title = "Mã vé vào cửa",
  subtitle = "Vui lòng xuất trình mã QR này tại cửa soát vé",
}) => {
  if (!tickets || tickets.length === 0) return null;

  return (
    <div className={styles.ticketsSection}>
      <div className={styles.ticketsSectionHeader}>
        <h3 className={styles.ticketsSectionTitle}>{title}</h3>
        <p className={styles.ticketsSectionSubtitle}>{subtitle}</p>
      </div>
      <div className={styles.ticketsList}>
        {tickets.map((ticket) => (
          <div key={ticket.id} className={styles.ticketCard}>
            <div className={styles.ticketTop}>
              <div className={styles.ticketSeatNumber}>
                {ticket.rowLetter}
                {ticket.seatNumber}
              </div>
              <p className={styles.ticketSeatType}>
                {getSeatTypeLabel(ticket.seatType)}
              </p>
            </div>
            <div className={styles.ticketDivider}></div>
            <div className={styles.ticketBottom}>
              {ticket.qrCode ? (
                <div className={styles.qrWrapper}>
                  <QRCodeSVG
                    value={ticket.qrCode}
                    size={108}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />
                </div>
              ) : (
                <div className={styles.qrCode}>
                  <div className={styles.qrInner}></div>
                </div>
              )}
              <p className={styles.ticketCode}>{ticket.qrCode}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketQRList;
