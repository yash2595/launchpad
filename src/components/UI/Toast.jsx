import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { hideToast } from '../../store/uiSlice';
import styles from './Toast.module.css';

export default function Toast() {
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector((state) => state.ui.toast);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let showTimer;
    let exitTimer;

    if (visible) {
      setShouldRender(true);
      setIsExiting(false);

      // Start exit transition after 3.5 seconds
      showTimer = setTimeout(() => {
        setIsExiting(true);
        // Dispatch hide after slide out transition (250ms)
        exitTimer = setTimeout(() => {
          dispatch(hideToast());
          setShouldRender(false);
        }, 250);
      }, 3500);
    } else {
      // If manually hidden before timer
      setIsExiting(true);
      exitTimer = setTimeout(() => {
        setShouldRender(false);
      }, 250);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
    };
  }, [visible, dispatch]);

  if (!shouldRender || !message) return null;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      dispatch(hideToast());
      setShouldRender(false);
    }, 250);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'danger':
        return <XCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const toastClass = [
    styles.toast,
    styles[`toast--${type}`],
    isExiting ? styles['toast--exiting'] : '',
  ].join(' ').trim();

  return (
    <div className={styles.toast__wrapper}>
      <div className={toastClass}>
        <div className={styles.toast__icon}>{getIcon()}</div>
        <div className={styles.toast__content}>
          <p className={styles.toast__message}>{message}</p>
        </div>
        <button className={styles.toast__close} onClick={handleClose} aria-label="Close notification">
          <X size={16} />
        </button>
        <div className={styles.toast__progress} key={message} />
      </div>
    </div>
  );
}
