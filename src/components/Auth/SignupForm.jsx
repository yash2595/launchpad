import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { signUp } from '../../services/authService';
import Button from '../UI/Button';
import styles from './AuthStyles.module.css';

export default function SignupForm() {
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  const validateField = (name, value) => {
    let errorMsg = '';
    
    if (name === 'fullName') {
      if (!value.trim()) {
        errorMsg = 'Full name is required';
      }
    } else if (name === 'email') {
      if (!value.trim()) {
        errorMsg = 'Email is required';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMsg = 'Please enter a valid email address';
        }
      }
    } else if (name === 'password') {
      if (!value) {
        errorMsg = 'Password is required';
      } else if (value.length < 8) {
        errorMsg = 'Password must be at least 8 characters';
      } else {
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        if (!hasUppercase || !hasNumber) {
          errorMsg = 'Must contain 1 uppercase letter and 1 number';
        }
      }
    } else if (name === 'confirmPassword') {
      if (value !== formFields.password) {
        errorMsg = 'Passwords do not match';
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    return !errorMsg;
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignUpError('');

    // Validate all fields
    const isNameValid = validateField('fullName', formFields.fullName);
    const isEmailValid = validateField('email', formFields.email);
    const isPassValid = validateField('password', formFields.password);
    const isConfirmValid = validateField('confirmPassword', formFields.confirmPassword);

    if (!isNameValid || !isEmailValid || !isPassValid || !isConfirmValid) {
      return;
    }

    setLoading(true);
    try {
      await signUp(formFields.email, formFields.password, formFields.fullName);
      // Success → redirect to /verify and pass the email to use
      navigate('/verify', { state: { email: formFields.email } });
    } catch (error) {
      setSignUpError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.auth__card}>
      <div className={styles.auth__header}>
        <h1 className={styles.auth__title}>Create Account</h1>
        <p className={styles.auth__subtitle}>Join LaunchPad and start tracking applications</p>
      </div>

      <form className={styles.auth__form} onSubmit={handleSignupSubmit}>
        <div className={styles.form__group}>
          <label className={styles.form__label} htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={`${styles.form__input} ${formErrors.fullName ? styles['form__input--error'] : ''}`}
            placeholder="Jane Doe"
            value={formFields.fullName}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={loading}
          />
          {formErrors.fullName && <div className={styles.form__error}>{formErrors.fullName}</div>}
        </div>

        <div className={styles.form__group}>
          <label className={styles.form__label} htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`${styles.form__input} ${formErrors.email ? styles['form__input--error'] : ''}`}
            placeholder="jane.doe@university.edu"
            value={formFields.email}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={loading}
          />
          {formErrors.email && <div className={styles.form__error}>{formErrors.email}</div>}
        </div>

        <div className={styles.form__group}>
          <label className={styles.form__label} htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className={`${styles.form__input} ${formErrors.password ? styles['form__input--error'] : ''}`}
            placeholder="••••••••"
            value={formFields.password}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={loading}
          />
          {formErrors.password && <div className={styles.form__error}>{formErrors.password}</div>}
        </div>

        <div className={styles.form__group}>
          <label className={styles.form__label} htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={`${styles.form__input} ${formErrors.confirmPassword ? styles['form__input--error'] : ''}`}
            placeholder="••••••••"
            value={formFields.confirmPassword}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={loading}
          />
          {formErrors.confirmPassword && (
            <div className={styles.form__error}>{formErrors.confirmPassword}</div>
          )}
        </div>

        {signUpError && <div className={styles.form__error}>{signUpError}</div>}

        <Button type="submit" disabled={loading} style={{ marginTop: '8px' }}>
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>

      <div className={styles.auth__footer}>
        Already have an account?
        <Link to="/login" className={styles.auth__link}>Sign in</Link>
      </div>
    </div>
  );
}
