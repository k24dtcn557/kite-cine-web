import React, { useEffect, useState } from "react";
import styles from "./RevenueChart.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  managementService,
  ChartColumnDto,
} from "../../../../api/management.service";
import { CommonUtils } from "../../../../utils/CommonUtils";

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

const revenuePerCinema = [
  { name: "Quận 1", revenue: 124500000 },
  { name: "Thủ Đức", revenue: 98200000 },
  { name: "Quận 7", revenue: 85000000 },
  { name: "Gò Vấp", revenue: 71000000 },
];

const COLORS = ["#e50914", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          padding: "10px",
          border: "1px solid var(--color-outline)",
          borderRadius: "8px",
          maxWidth: "200px",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            color: "var(--color-on-surface)",
          }}
        >
          {label || payload[0].payload.name}
        </p>
        <p style={{ margin: 0, color: "var(--color-primary)" }}>
          {CommonUtils.formatNumberVietnamese(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const formatYAxis = (tickItem: number) => {
  if (tickItem >= 1000000000) {
    return (tickItem / 1000000000).toString() + " Tỷ";
  }
  return (tickItem / 1000000).toString() + " Tr";
};

const renderCustomMovieTick = ({ x, y, payload }: any) => {
  const text = payload.value as string;
  const maxLen = 16;
  let line1 = text;
  let line2 = "";

  if (text.length > maxLen) {
    const words = text.split(" ");
    if (words.length > 1) {
      // Find a breaking point (roughly half)
      let splitIndex = Math.floor(words.length / 2);
      line1 = words.slice(0, splitIndex).join(" ");
      line2 = words.slice(splitIndex).join(" ");

      // If still too long, truncate
      if (line1.length > maxLen) line1 = line1.substring(0, maxLen - 3) + "...";
      if (line2.length > maxLen) line2 = line2.substring(0, maxLen - 3) + "...";
    } else {
      line1 = text.substring(0, maxLen - 3) + "...";
    }
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={line2 ? -4 : 4}
        textAnchor="end"
        fill="var(--color-on-surface-variant)"
        fontSize="0.75rem"
      >
        <tspan x={-10} dy="0">
          {line1}
        </tspan>
        {line2 && (
          <tspan x={-10} dy="1.2em">
            {line2}
          </tspan>
        )}
      </text>
    </g>
  );
};

const RevenueChart: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [reportType, setReportType] = useState<ReportType>(
    ReportType.SEVEN_DAYS,
  );
  const [revenueData, setRevenueData] = useState<ChartColumnDto[]>([]);
  const [revenueMovieData, setRevenueMovieData] = useState<ChartColumnDto[]>(
    [],
  );

  useEffect(() => {
    setMounted(true);
    fetchMovieRevenue();
  }, []);

  const fetchMovieRevenue = async () => {
    try {
      const data = await managementService.getRevenueReport("BY_MOVIE");
      setRevenueMovieData(data);
    } catch (error) {
      console.error("Failed to fetch movie revenue report:", error);
    }
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const data = await managementService.getRevenueReport(reportType);
        setRevenueData(data);
      } catch (error) {
        console.error("Failed to fetch revenue report:", error);
      }
    };
    fetchRevenue();
  }, [reportType]);

  if (!mounted) return <div className={styles.chartContainer}>Loading...</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "100%",
      }}
    >
      {/* 1. Revenue per Date (Line/Area) */}
      <div className={styles.chartContainer}>
        <div className={styles.header}>
          <div>
            <h4 className={styles.title}>Doanh thu</h4>
            <p className={styles.subtitle}>{ReportTypeText[reportType]}</p>
          </div>
          <select
            className={styles.select}
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
          >
            {Object.entries(ReportTypeText).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueData}
              margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-outline-variant)"
              />
              <XAxis
                dataKey="label"
                stroke="var(--color-on-surface-variant)"
                tick={{ fill: "var(--color-on-surface-variant)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                stroke="var(--color-on-surface-variant)"
                tick={{ fill: "var(--color-on-surface-variant)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="value"
                fill="url(#colorRevenue)"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* 2. Revenue per Cinema */}
        <div className={styles.chartContainer}>
          <div className={styles.header}>
            <div>
              <h4 className={styles.title}>Doanh thu theo rạp</h4>
              <p className={styles.subtitle}>Top 4 rạp doanh thu cao nhất</p>
            </div>
          </div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenuePerCinema}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {revenuePerCinema.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {revenuePerCinema.map((entry, index) => (
                <div
                  key={entry.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    color: "var(--color-on-surface)",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Revenue per Movie */}
        <div className={styles.chartContainer}>
          <div className={styles.header}>
            <div>
              <h4 className={styles.title}>Doanh thu theo phim</h4>
              <p className={styles.subtitle}>Top phim đang chiếu</p>
            </div>
          </div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueMovieData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="var(--color-outline-variant)"
                />
                <XAxis
                  type="number"
                  tickFormatter={formatYAxis}
                  stroke="var(--color-on-surface-variant)"
                  tick={{ fill: "var(--color-on-surface-variant)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="label"
                  type="category"
                  stroke="var(--color-on-surface-variant)"
                  tick={renderCustomMovieTick}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="value"
                  fill="var(--color-secondary)"
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
