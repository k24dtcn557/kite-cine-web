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
