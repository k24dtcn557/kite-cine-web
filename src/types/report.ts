export enum ReportType {
  SEVEN_DAYS = "SEVEN_DAYS",
  THIRTY_DAYS = "THIRTY_DAYS",
  ONE_YEAR = "ONE_YEAR",
}

export const ReportTypeText: Record<ReportType, string> = {
  [ReportType.SEVEN_DAYS]: "7 ngày gần nhất",
  [ReportType.THIRTY_DAYS]: "30 ngày gần nhất",
  [ReportType.ONE_YEAR]: "12 tháng gần nhất",
};

export enum CinemaReportType {
  BY_CINEMA_30_DAYS = "BY_CINEMA_30_DAYS",
  BY_CINEMA_90_DAYS = "BY_CINEMA_90_DAYS",
  BY_CINEMA_1_YEAR = "BY_CINEMA_1_YEAR",
}

export const CinemaReportTypeText: Record<CinemaReportType, string> = {
  [CinemaReportType.BY_CINEMA_30_DAYS]: "30 ngày gần nhất",
  [CinemaReportType.BY_CINEMA_90_DAYS]: "90 ngày gần nhất",
  [CinemaReportType.BY_CINEMA_1_YEAR]: "1 năm gần nhất",
};
