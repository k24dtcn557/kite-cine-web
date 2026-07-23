export class CommonUtils {
  /**
   * Formats a date string into the standard Vietnamese date format (DD/MM/YYYY).
   */
  static formatDateVietnamese(dateString: string | undefined): string {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  /**
   * Formats a date string to include the day of the week (e.g. "Thứ Năm, 21/07/2026")
   */
  static formatDateVN(dateStr?: string): string {
    if (!dateStr) return "Ngày chiếu";
    try {
      const d = new Date(
        dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`,
      );
      const days = [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
      ];
      const dd = d.getDate().toString().padStart(2, "0");
      const mm = (d.getMonth() + 1).toString().padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${days[d.getDay()]}, ${dd}/${mm}/${yyyy}`;
    } catch {
      return dateStr;
    }
  }

  /**
   * Formats a date string to include the day of the week (e.g. "Thứ Năm, 21/07/2026")
   */
  static formatShortDateVN(dateStr?: string): string {
    if (!dateStr) return "Ngày chiếu";
    try {
      const d = new Date(
        dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`,
      );
      const dd = d.getDate().toString().padStart(2, "0");
      const mm = (d.getMonth() + 1).toString().padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return dateStr;
    }
  }

  static formatTimeVN(timeStr?: string): string {
    return timeStr?.substring(0, 5) || "";
  }

  /**
   * Formats runtime in minutes to a Vietnamese string (e.g., "2 giờ 15 phút").
   */
  static formatRuntimeVietnamese(runtimeMinutes: number | undefined): string {
    if (!runtimeMinutes || runtimeMinutes <= 0) return "N/A";
    const hours = Math.floor(runtimeMinutes / 60);
    const minutes = runtimeMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} giờ ${minutes} phút`;
    } else if (hours > 0) {
      return `${hours} giờ`;
    } else {
      return `${minutes} phút`;
    }
  }

  /**
   * Converts a YouTube watch URL or youtu.be URL to an embed URL.
   * If it's already an embed URL or not a YouTube URL, it returns the original.
   */
  static getYouTubeEmbedUrl(url: string | undefined): string {
    if (!url) return "";

    // Check if it's already an embed URL
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // Match watch?v= format
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
    }

    // Match youtu.be/ format
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
    }

    return url;
  }

  /**
   * Formats a number to 0 decimal places in Vietnamese format (e.g., 10000 -> 10.000)
   */
  static formatNumberVietnamese(amount: number | undefined | null): string {
    if (amount === undefined || amount === null || isNaN(amount)) return "";
    return new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
