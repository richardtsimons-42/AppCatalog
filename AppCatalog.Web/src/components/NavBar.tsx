import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          📦 App Catalog
        </Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            My Apps
          </Link>
          <Link to="/add" style={styles.link}>
            + Add App
          </Link>
        </div>
        <div style={styles.userSection}>
          <span style={styles.username}>
            👋 {user?.firstName} {user?.lastName}
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '0 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  username: {
    fontSize: '14px',
    color: '#ccc',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #666',
    color: '#ccc',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};
