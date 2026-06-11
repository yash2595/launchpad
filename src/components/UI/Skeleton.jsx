import styles from './Skeleton.module.css';

export default function Skeleton({
  width = '100%',
  height = '16px',
  variant = 'rect', // 'rect' | 'circle'
  className = '',
  style = {},
}) {
  const skeletonClass = [
    styles.skeleton,
    variant === 'circle' ? styles['skeleton--circle'] : '',
    className
  ].join(' ').trim();

  const customStyle = {
    width,
    height,
    ...style,
  };

  return <span className={skeletonClass} style={customStyle} />;
}
