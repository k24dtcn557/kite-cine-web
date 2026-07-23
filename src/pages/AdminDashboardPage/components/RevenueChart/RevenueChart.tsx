import React, { useEffect, useState } from 'react';
import styles from './RevenueChart.module.css';
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
  Cell
} from 'recharts';

const revenuePerDate = [
  { name: '17/07', revenue: 152000000 },
  { name: '18/07', revenue: 168000000 },
  { name: '19/07', revenue: 145000000 },
  { name: '20/07', revenue: 210000000 },
  { name: '21/07', revenue: 280000000 },
  { name: '22/07', revenue: 260000000 },
  { name: '23/07', revenue: 248590000 },
];

const revenuePerCinema = [
  { name: 'Quận 1', revenue: 124500000 },
  { name: 'Thủ Đức', revenue: 98200000 },
  { name: 'Quận 7', revenue: 85000000 },
  { name: 'Gò Vấp', revenue: 71000000 },
];

const revenuePerMovie = [
  { name: 'Dune 2', revenue: 110000000 },
  { name: 'Mai', revenue: 85000000 },
  { name: 'Challengers', revenue: 65000000 },
  { name: 'Godzilla x Kong', revenue: 55000000 },
];

const COLORS = ['#e50914', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'var(--color-surface)', padding: '10px', border: '1px solid var(--color-outline)', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-on-surface)' }}>{label || payload[0].payload.name}</p>
        <p style={{ margin: 0, color: 'var(--color-primary)' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const formatYAxis = (tickItem: number) => {
  return (tickItem / 1000000).toString() + 'M';
};

const RevenueChart: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={styles.chartContainer}>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* 1. Revenue per Date (Line/Area) */}
      <div className={styles.chartContainer}>
        <div className={styles.header}>
          <div>
            <h4 className={styles.title}>Doanh thu theo ngày</h4>
            <p className={styles.subtitle}>7 ngày gần nhất</p>
          </div>
        </div>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenuePerDate} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
              <XAxis dataKey="name" stroke="var(--color-on-surface-variant)" tick={{ fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatYAxis} stroke="var(--color-on-surface-variant)" tick={{ fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* 2. Revenue per Cinema */}
        <div className={styles.chartContainer}>
          <div className={styles.header}>
            <div>
              <h4 className={styles.title}>Doanh thu theo rạp</h4>
              <p className={styles.subtitle}>Top 4 rạp doanh thu cao nhất</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              {revenuePerCinema.map((entry, index) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-on-surface)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
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
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenuePerMovie} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-outline-variant)" />
                <XAxis type="number" tickFormatter={formatYAxis} stroke="var(--color-on-surface-variant)" tick={{ fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--color-on-surface-variant)" tick={{ fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="revenue" fill="var(--color-secondary)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
