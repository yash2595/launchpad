import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './DashboardStyles.module.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.custom_tooltip}>
        <p className={styles.custom_tooltip__label}>Week of {payload[0].payload.name}</p>
        <p className={styles.custom_tooltip__value}>
          Added: <strong>{payload[0].value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export default function WeeklyLineChart({ internships = [] }) {
  const generateWeeklyData = () => {
    const data = [];
    const today = new Date();

    // Generate 8 weeks of data
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(today.getDate() - i * 7 - 6);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date();
      weekEnd.setDate(today.getDate() - i * 7);
      weekEnd.setHours(23, 59, 59, 999);

      const count = internships.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= weekStart && itemDate <= weekEnd;
      }).length;

      const label = weekStart.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      data.push({
        name: label,
        Applications: count,
      });
    }

    return data;
  };

  const chartData = generateWeeklyData();

  return (
    <div className={styles.chart_box}>
      <div className={styles.chart_box__header}>
        <h3 className={styles.chart_box__title}>Weekly Activity (Last 8 Weeks)</h3>
      </div>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="Applications"
              stroke="var(--color-accent)"
              strokeWidth={3}
              dot={{ stroke: 'var(--color-accent)', strokeWidth: 2, r: 4, fill: '#FFFFFF' }}
              activeDot={{ r: 6, fill: 'var(--color-accent)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
