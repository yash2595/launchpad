import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import styles from '../components/Auth/AuthStyles.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.auth__page}>
      <div className={styles.auth__card} style={{ textAlign: 'center' }}>
        <h1 className={styles.auth__title} style={{ fontSize: '48px', color: 'var(--color-accent)' }}>404</h1>
        <p className={styles.auth__title} style={{ fontSize: '18px', marginTop: '12px' }}>Page Not Found</p>
        <p className={styles.auth__subtitle} style={{ marginBottom: '24px' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Button onClick={handleReturnHome} style={{ width: '100%' }}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
