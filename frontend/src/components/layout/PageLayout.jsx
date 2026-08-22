import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Wraps every protected page (Dashboard, Traces, Alerts, Settings) —
// <Outlet /> renders whichever child route matched, per router.jsx
const PageLayout = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.main}>
        <Navbar />
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
  },
};

export default PageLayout;