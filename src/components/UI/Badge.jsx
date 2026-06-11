import styles from './Badge.module.css';

export default function Badge({ type = 'status', value = '', count = null }) {
  const normalizedValue = value.toLowerCase();
  const badgeClass = [
    styles.badge,
    styles[`badge--${type}-${normalizedValue}`],
  ].join(' ').trim();

  return (
    <span className={badgeClass}>
      {value}
      {count !== null && (
        <span className={styles.badge__count}>
          {count}
        </span>
      )}
    </span>
  );
}
