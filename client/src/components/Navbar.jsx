import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.navTop}>
        <Link to="/search" style={styles.logo}>SkillSwap</Link>

        {/* Hamburger for mobile */}
        <button
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          className="navbar-hamburger"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop links */}
        <div style={styles.links} className="navbar-links-desktop">
          <Link to="/search" style={styles.link}>Search</Link>
          <Link to="/matches" style={styles.link}>✨ AI Matches</Link>
          <Link to="/swaps" style={styles.link}>My Swaps</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>
          <span style={styles.credits}>⭐ {user.credits ?? '...'}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={styles.mobileMenu} className="navbar-links-mobile">
          <Link to="/search" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Search</Link>
          <Link to="/matches" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>✨ AI Matches</Link>
          <Link to="/swaps" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Swaps</Link>
          <Link to="/profile" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Profile</Link>
          <div style={styles.mobileCredits}>⭐ {user.credits ?? '...'} credits</div>
          <button onClick={handleLogout} style={styles.mobileLogoutBtn}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#6c63ff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    position: 'relative',
  },
  navTop: {
    padding: '0 24px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
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
  mobileMenu: {
    display: 'none',
    flexDirection: 'column',
    padding: '16px 24px',
    gap: '14px',
    backgroundColor: '#5a52e0',
  },
  mobileLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
  },
  mobileCredits: {
    color: '#ffd700',
    fontWeight: '600',
    fontSize: '14px',
  },
  mobileLogoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;