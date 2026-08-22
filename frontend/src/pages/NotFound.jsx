import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const NotFound = () => {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.text}>Page not found</p>
      <Link to={ROUTES.DASHBOARD} style={styles.link}>Go to Dashboard</Link>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1117',
    color: '#e4e6eb',
  },
  code: { fontSize: '48px', marginBottom: '8px' },
  text: { fontSize: '15px', color: '#9199a8', marginBottom: '20px' },
  link: { color: '#5b8def', fontWeight: 600 },
};

export default NotFound;