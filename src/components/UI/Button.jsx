import styles from './Button.module.css';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'danger', 'warning', 'text'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  className = '',
  ...props
}) {
  const buttonClass = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    className
  ].join(' ').trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
