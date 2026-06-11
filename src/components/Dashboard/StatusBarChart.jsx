import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './DashboardStyles.module.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.custom_tooltip}>
        <p className={styles.custom_tooltip__label}>{payload[0].payload.name}</p>
        <p className={styles.custom_tooltip__value}>
          Count: <strong>{payload[0].value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export default function StatusBarChart({ internships = [] }) {
  const statusCounts = {
    Applied: 0,
    Screening: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };

  internships.forEach((item) => {
    if (statusCounts[item.status] !== undefined) {
      statusCounts[item.status]++;
    }
  });

  const chartData = [
    { name: 'Applied', count: statusCounts.Applied, color: '#3B82F6' },
    { name: 'Screening', count: statusCounts.Screening, color: '#F59E0B' },
    { name: 'Interview', count: statusCounts.Interview, color: '#6366F1' },
    { name: 'Offer', count: statusCounts.Offer, color: '#10B981' },
    { name: 'Rejected', count: statusCounts.Rejected, color: '#EF4444' },
  ];

  return (
    <div className={styles.chart_box}>
      <div className={styles.chart_box__header}>
        <h3 className={styles.chart_box__title}>Application Status</h3>
      </div>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
