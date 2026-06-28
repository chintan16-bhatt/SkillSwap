import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <Link to="/search" style={styles.logo}>SkillSwap</Link>

      <div style={styles.links}>
        <Link to="/search" style={styles.link}>Search</Link>
        <Link to="/swaps" style={styles.link}>My Swaps</Link>
        <Link to="/profile" style={styles.link}>Profile</Link>
        <span style={styles.credits}>⭐ {user.credits ?? '...'}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#6c63ff',
    padding: '0 24px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  logo: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  credits: {
    color: '#ffd700',
    fontWeight: '600',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;