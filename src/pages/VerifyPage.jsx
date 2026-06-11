import OtpVerify from '../components/Auth/OtpVerify';
import styles from '../components/Auth/AuthStyles.module.css';

export default function VerifyPage() {
  return (
    <div className={styles.auth__page}>
      <OtpVerify />
    </div>
  );
}
