import { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md', // 'md' | 'large'
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalClass = [
    styles.modal,
    size === 'large' ? styles['modal--large'] : '',
  ].join(' ').trim();

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={modalClass}>
        <div className={styles.modal__header}>
          <h2 className={styles.modal__title}>{title}</h2>
          <button className={styles.modal__close} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className={styles.modal__content}>
          {children}
        </div>
      </div>
    </div>
  );
}
