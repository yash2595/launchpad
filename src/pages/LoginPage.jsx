import LoginForm from '../components/Auth/LoginForm';
import styles from '../components/Auth/AuthStyles.module.css';

export default function LoginPage() {
  return (
    <div className={styles.auth__page}>
      <LoginForm />
    </div>
  );
}
