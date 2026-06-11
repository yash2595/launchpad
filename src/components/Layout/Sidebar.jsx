import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LayoutDashboard, Briefcase, LogOut, Rocket, BookOpen } from 'lucide-react';
import { signOut } from '../../services/authService';
import { clearAuthSession } from '../../store/authSlice';
import { showToast } from '../../store/uiSlice';
import { NAV_LINKS } from '../../utils/constants';
import styles from './Sidebar.module.css';

export default function Sidebar({ mobileOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await signOut();
      dispatch(clearAuthSession());
      dispatch(showToast({ message: 'Logged out successfully', type: 'success' }));
      navigate('/login');
      if (onClose) onClose();
    } catch (error) {
      dispatch(showToast({ message: 'Failed to log out', type: 'danger' }));
    }
  };

  const getIcon = (name) => {
    switch (name) {
      case 'LayoutDashboard':
        return <LayoutDashboard size={20} />;
      case 'Briefcase':
        return <Briefcase size={20} />;
      case 'BookOpen':
        return <BookOpen size={20} />;
      default:
        return null;
    }
  };

  const sidebarClass = [
    styles.sidebar,
    mobileOpen ? `${styles['sidebar--mobile-drawer']} ${styles['sidebar--open']}` : '',
  ].join(' ').trim();

  return (
    <>
      {mobileOpen && (
        <div className={styles.sidebar_backdrop} onClick={onClose} />
      )}
      <aside className={sidebarClass}>
        <div className={styles.sidebar__brand}>
          <Rocket className={styles.sidebar__logo} size={24} />
          <span className={styles.sidebar__name}>LaunchPad</span>
        </div>

        <nav className={styles.sidebar__nav}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                [
                  styles.sidebar__link,
                  isActive ? styles['sidebar__link--active'] : '',
                ].join(' ').trim()
              }
              onClick={onClose}
            >
              {getIcon(link.icon)}
              <span className={styles.sidebar__link_text}>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebar__footer}>
          <button className={styles.sidebar__logout} onClick={handleLogoutClick}>
            <LogOut size={20} />
            <span className={styles.sidebar__link_text}>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
