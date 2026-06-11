import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { verifyOtp, resendOtp } from '../../services/authService';
import { setAuthSession } from '../../store/authSlice';
import { showToast } from '../../store/uiSlice';
import Button from '../UI/Button';
import styles from './AuthStyles.module.css';

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = location.state?.email || '';
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const digitInputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      dispatch(showToast({ message: 'No email found for verification. Please sign up.', type: 'warning' }));
      navigate('/signup');
    }
  }, [email, navigate, dispatch]);

  useEffect(() => {
    if (timerSeconds <= 0) return;
    const intervalId = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timerSeconds]);

  const handleDigitChange = (index, value) => {
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    if (!sanitizedValue) return;

    const newValues = [...otpValues];
    // Keep only last character
    newValues[index] = sanitizedValue.slice(-1);
    setOtpValues(newValues);
    setErrorMsg('');

    // Auto focus next input
    if (index < 5) {
      digitInputRefs.current[index + 1].focus();
    }
  };

  const handleDigitKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      const newValues = [...otpValues];
      if (newValues[index]) {
        // If current box is filled, clear it
        newValues[index] = '';
        setOtpValues(newValues);
      } else if (index > 0) {
        // If current box is empty, clear previous and focus it
        newValues[index - 1] = '';
        setOtpValues(newValues);
        digitInputRefs.current[index - 1].focus();
      }
      setErrorMsg('');
    }
  };

  const handleDigitsPaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedText)) return;

    const newValues = pastedText.split('');
    setOtpValues(newValues);
    setErrorMsg('');
    // Focus last input box
    digitInputRefs.current[5].focus();
  };

  const handleVerifySubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    const token = otpValues.join('');
    if (token.length < 6) {
      setErrorMsg('Please enter all 6 digits');
      setShake(true);
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp(email, token, 'signup');
      dispatch(setAuthSession(data.session));
      dispatch(showToast({ message: 'Account verified successfully!', type: 'success' }));
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg('That code is incorrect');
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendOtp(email, 'signup');
      setTimerSeconds(60);
      setOtpValues(Array(6).fill(''));
      dispatch(showToast({ message: 'Verification code resent to your email.', type: 'success' }));
      digitInputRefs.current[0].focus();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to resend code', type: 'danger' }));
    }
  };

  return (
    <div className={styles.auth__card}>
      <div className={styles.auth__header}>
        <h1 className={styles.auth__title}>Verify Email</h1>
        <p className={styles.auth__subtitle}>We sent a 6-digit code to {email}</p>
      </div>

      <form onSubmit={handleVerifySubmit}>
        <div
          className={`${styles.otp__row} ${shake ? styles['otp__row--shake'] : ''}`}
          onAnimationEnd={() => setShake(false)}
        >
          {otpValues.map((value, idx) => (
            <input
              key={idx}
              ref={(element) => (digitInputRefs.current[idx] = element)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className={`${styles.otp__input} ${errorMsg ? styles['otp__input--error'] : ''}`}
              value={value}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleDigitKeyDown(idx, e)}
              onPaste={handleDigitsPaste}
              disabled={loading}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {errorMsg && (
          <div className={styles.form__error} style={{ textAlign: 'center', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        <Button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>
      </form>

      <div className={styles.otp__timer}>
        {timerSeconds > 0 ? (
          `Resend code in ${timerSeconds}s`
        ) : (
          <button className={styles.otp__resend_btn} onClick={handleResendCode} disabled={loading}>
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}
