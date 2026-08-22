import { useAuth } from '../../hooks/useAuth';
import { useOrgContext } from '../../context/OrgContext';
import Button from '../common/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { selectedProjectId } = useOrgContext();

  return (
    <header style={styles.navbar}>
      <div style={styles.projectLabel}>
        {selectedProjectId ? `Project: ${selectedProjectId.slice(0, 8)}...` : 'No project selected'}
      </div>

      <div style={styles.right}>
        <span style={styles.userEmail}>{user?.email}</span>
        <Button variant="secondary" onClick={logout}>
          Log out
        </Button>
      </div>
    </header>
  );
};

const styles = {
  navbar: {
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    borderBottom: '1px solid #2c2f3d',
    backgroundColor: '#0f1117',
  },
  projectLabel: {
    fontSize: '13px',
    color: '#9199a8',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userEmail: {
    fontSize: '13px',
    color: '#c1c5cd',
  },
};

export default Navbar;