import SignupForm from '../components/Auth/SignupForm';
import styles from '../components/Auth/AuthStyles.module.css';

export default function SignupPage() {
  return (
    <div className={styles.auth__page}>
      <SignupForm />
    </div>
  );
}
