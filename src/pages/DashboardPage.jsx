import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, Calendar } from 'lucide-react';
import { getAllInternships } from '../services/internshipService';
import { setInternships, setInternshipsLoading, setInternshipsError } from '../store/internshipsSlice';
import { showToast } from '../store/uiSlice';
import StatsRow from '../components/Dashboard/StatsRow';
import StatusBarChart from '../components/Dashboard/StatusBarChart';
import WeeklyLineChart from '../components/Dashboard/WeeklyLineChart';
import Skeleton from '../components/UI/Skeleton';
import styles from '../components/Dashboard/DashboardStyles.module.css';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: internships, loading } = useSelector((state) => state.internships);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      dispatch(setInternshipsLoading(true));
      try {
        const data = await getAllInternships(user.id);
        dispatch(setInternships(data));
      } catch (err) {
        dispatch(setInternshipsError(err.message || 'Failed to load internships'));
        dispatch(
          showToast({
            message: 'Could not load your internships right now',
            type: 'danger',
          })
        );
      }
    };

    loadData();
  }, [user, dispatch]);

  // Derive upcoming deadlines (next 7 days)
  const getDeadlineAlerts = () => {
    const alerts = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    internships.forEach((item) => {
      if (!item.deadline || item.status === 'Offer' || item.status === 'Rejected') return;

      const deadlineDate = new Date(item.deadline);
      deadlineDate.setHours(0, 0, 0, 0);

      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 7) {
        alerts.push({
          id: item.id,
          company: item.company_name,
          daysLeft: diffDays,
        });
      }
    });

    // Sort alerts by urgency (daysLeft ascending)
    return alerts.sort((a, b) => a.daysLeft - b.daysLeft);
  };

  const deadlineAlerts = getDeadlineAlerts();

  if (loading && internships.length === 0) {
    return (
      <div className={styles.dashboard}>
        {/* Skeleton StatsRow */}
        <div className={styles.stats_row}>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className={styles.stat_card}>
              <Skeleton width="100px" height="14px" />
              <Skeleton width="40px" height="30px" style={{ marginTop: '8px' }} />
            </div>
          ))}
        </div>
        {/* Skeleton Charts */}
        <div className={styles.charts_grid} style={{ marginTop: '16px' }}>
          <Skeleton height="380px" />
          <Skeleton height="380px" />
        </div>
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || 'Student';

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard__header}>
        <div className={styles.dashboard__header_left}>
          <h2 className={styles.dashboard__title}>Welcome back, {fullName}! 👋</h2>
          <p className={styles.dashboard__subtitle}>Here is a quick overview of your internship application journey.</p>
        </div>
      </div>

      <StatsRow internships={internships} />

      {/* Deadline alert strip */}
      {deadlineAlerts.length > 0 && (
        <div className={styles.alert_strip}>
          <div className={styles.alert_strip__title}>
            <AlertCircle size={16} style={{ color: 'var(--color-warning)', verticalAlign: 'middle', marginRight: '4px' }} />
            Upcoming Deadlines:
          </div>
          {deadlineAlerts.map((alert) => {
            const isCritical = alert.daysLeft <= 1;
            const pillClass = [
              styles.alert_pill,
              isCritical ? styles['alert_pill--danger'] : styles['alert_pill--warning'],
            ].join(' ').trim();

            const text = alert.daysLeft === 0 
              ? `${alert.company} — Today`
              : alert.daysLeft === 1
              ? `${alert.company} — 1 day left`
              : `${alert.company} — ${alert.daysLeft} days left`;

            return (
              <span key={alert.id} className={pillClass}>
                <Calendar size={12} style={{ marginRight: '4px' }} />
                {text}
              </span>
            );
          })}
        </div>
      )}

      <div className={styles.charts_grid}>
        <StatusBarChart internships={internships} />
        <WeeklyLineChart internships={internships} />
      </div>
    </div>
  );
}
