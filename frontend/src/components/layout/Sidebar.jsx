import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const navItems = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
  { label: 'Traces', path: ROUTES.TRACES, icon: '🔍' },
  { label: 'Alerts', path: ROUTES.ALERTS, icon: '🔔' },
  { label: 'API Keys', path: ROUTES.SETTINGS_API_KEYS, icon: '🔑' },
];

const Sidebar = () => {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>Observability</div>

      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <span style={{ marginRight: '10px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '220px',
    minHeight: '100vh',
    backgroundColor: '#161822',
    borderRight: '1px solid #2c2f3d',
    padding: '20px 12px',
    flexShrink: 0,
  },
  logo: {
    fontSize: '16px',
    fontWeight: 700,
    padding: '8px 12px 24px',
    color: '#e4e6eb',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#9199a8',
  },
  navItemActive: {
    backgroundColor: '#1f2230',
    color: '#e4e6eb',
    fontWeight: 600,
  },
};

export default Sidebar;