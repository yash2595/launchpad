import { Briefcase, Clock, MessageSquare, CheckCircle2, XCircle } from 'lucide-react';
import styles from './DashboardStyles.module.css';

export default function StatsRow({ internships = [] }) {
  const getSevenDaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  };

  const sevenDaysAgo = getSevenDaysAgo();

  const getWeeklyDelta = (items) => {
    return items.filter((item) => new Date(item.created_at) >= sevenDaysAgo).length;
  };

  const totalApps = internships;
  const inProgress = internships.filter((item) =>
    ['Applied', 'Screening', 'Interview'].includes(item.status)
  );
  const interviews = internships.filter((item) => item.status === 'Interview');
  const offers = internships.filter((item) => item.status === 'Offer');
  const rejected = internships.filter((item) => item.status === 'Rejected');

  const stats = [
    {
      label: 'Total Applications',
      count: totalApps.length,
      delta: getWeeklyDelta(totalApps),
      icon: <Briefcase size={20} />,
      theme: 'indigo',
    },
    {
      label: 'In Progress',
      count: inProgress.length,
      delta: getWeeklyDelta(inProgress),
      icon: <Clock size={20} />,
      theme: 'warning',
    },
    {
      label: 'Interviews',
      count: interviews.length,
      delta: getWeeklyDelta(interviews),
      icon: <MessageSquare size={20} />,
      theme: 'info',
    },
    {
      label: 'Offers',
      count: offers.length,
      delta: getWeeklyDelta(offers),
      icon: <CheckCircle2 size={20} />,
      theme: 'success',
    },
    {
      label: 'Rejected',
      count: rejected.length,
      delta: getWeeklyDelta(rejected),
      icon: <XCircle size={20} />,
      theme: 'danger',
    },
  ];

  return (
    <div className={styles.stats_row}>
      {stats.map((stat, idx) => (
        <div key={idx} className={styles.stat_card}>
          <div className={styles.stat_card__header}>
            <span className={styles.stat_card__label}>{stat.label}</span>
            <div className={`${styles.stat_card__icon_wrapper} ${styles['stat_card__icon_wrapper--' + stat.theme]}`}>
              {stat.icon}
            </div>
          </div>
          <div className={styles.stat_card__content}>
            <span className={styles.stat_card__number}>{stat.count}</span>
            {stat.delta > 0 && (
              <span className={styles.stat_card__delta}>
                +{stat.delta} this week
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

