import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn } from '../../services/authService';
import { setAuthSession } from '../../store/authSlice';
import { showToast } from '../../store/uiSlice';
import Button from '../UI/Button';
import styles from './AuthStyles.module.css';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    
    if (!email || !password) {
      setAuthError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const data = await signIn(email, password);
      dispatch(setAuthSession(data.session));
      dispatch(showToast({ message: 'Welcome back!', type: 'success' }));
      navigate('/dashboard');
    } catch (error) {
      setAuthError('Email or password is incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.auth__card}>
      <div className={styles.auth__header}>
        <h1 className={styles.auth__title}>Welcome back</h1>
        <p className={styles.auth__subtitle}>Enter your details to access LaunchPad</p>
      </div>

      <form className={styles.auth__form} onSubmit={handleLoginSubmit}>
        <div className={styles.form__group}>
          <label className={styles.form__label} htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className={`${styles.form__input} ${authError ? styles['form__input--error'] : ''}`}
            placeholder="name@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.form__group}>
          <label className={styles.form__label} htmlFor="password">Password</label>
          <div className={styles.input__wrapper}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`${styles.form__input} ${authError ? styles['form__input--error'] : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className={styles.password__toggle}
              onClick={handleTogglePassword}
              disabled={loading}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {authError && <div className={styles.form__error}>{authError}</div>}

        <Button type="submit" disabled={loading} style={{ marginTop: '8px' }}>
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className={styles.auth__footer}>
        Don't have an account?
        <Link to="/signup" className={styles.auth__link}>Sign up</Link>
      </div>
    </div>
  );
}
