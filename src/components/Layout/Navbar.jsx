import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, LayoutDashboard, Briefcase, PlusCircle, LogOut, BookOpen } from 'lucide-react';
import { showModal } from '../../store/uiSlice';
import { signOut } from '../../services/authService';
import { clearAuthSession } from '../../store/authSlice';
import { showToast } from '../../store/uiSlice';
import styles from './Navbar.module.css';

export default function Navbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const fullName = user?.user_metadata?.full_name || 'Student';
  const avatarLetter = fullName.charAt(0);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/internships':
        return 'Internship Tracker';
      case '/learning':
        return 'Learning Log';
      default:
        return 'LaunchPad';
    }
  };

  const handleMobileLogout = async () => {
    try {
      await signOut();
      dispatch(clearAuthSession());
      dispatch(showToast({ message: 'Logged out successfully', type: 'success' }));
      navigate('/login');
    } catch (error) {
      dispatch(showToast({ message: 'Failed to log out', type: 'danger' }));
    }
  };

  const handleOpenAddModal = () => {
    dispatch(showModal({ type: 'add', data: null }));
  };

  return (
    <>
      <header className={styles.navbar}>
        <button
          className={styles.navbar__menu_btn}
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>

        <h1 className={styles.navbar__title}>{getPageTitle()}</h1>

        <div className={styles.navbar__actions}>
          <div className={styles.navbar__user}>
            <span className={styles.navbar__username}>{fullName}</span>
            <div className={styles.navbar__avatar}>{avatarLetter}</div>
          </div>
        </div>
      </header>

      {/* Bottom Nav Bar for Mobile Devices */}
      <nav className={styles.bottom_nav}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            [
              styles.bottom_nav__link,
              isActive ? styles['bottom_nav__link--active'] : '',
            ].join(' ').trim()
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/internships"
          className={({ isActive }) =>
            [
              styles.bottom_nav__link,
              isActive ? styles['bottom_nav__link--active'] : '',
            ].join(' ').trim()
          }
        >
          <Briefcase size={20} />
          <span>Tracker</span>
        </NavLink>

        <NavLink
          to="/learning"
          className={({ isActive }) =>
            [
              styles.bottom_nav__link,
              isActive ? styles['bottom_nav__link--active'] : '',
            ].join(' ').trim()
          }
        >
          <BookOpen size={20} />
          <span>Learning</span>
        </NavLink>

        <button
          className={styles.bottom_nav__link}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          onClick={handleOpenAddModal}
        >
          <PlusCircle size={20} style={{ color: 'var(--color-accent)' }} />
          <span style={{ color: 'var(--color-accent)' }}>Add New</span>
        </button>

        <button
          className={styles.bottom_nav__link}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          onClick={handleMobileLogout}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </nav>
    </>
  );
}
