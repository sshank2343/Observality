import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/common/Button';

const Signup = () => {
  const { register, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ email, password, orgName });
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Start monitoring your AI applications in minutes</p>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Organization name</label>
        <input
          style={styles.input}
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Acme Inc"
          required
        />

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <div style={{ marginTop: '20px' }}>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </div>

        <p style={styles.footerText}>
          Already have an account? <Link to={ROUTES.LOGIN} style={styles.link}>Log in</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1117',
  },
  card: {
    width: '380px',
    backgroundColor: '#161822',
    padding: '32px',
    borderRadius: '10px',
    border: '1px solid #2c2f3d',
  },
  title: { fontSize: '22px', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#9199a8', marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', marginBottom: '6px', marginTop: '14px', color: '#c1c5cd' },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #2c2f3d',
    backgroundColor: '#0f1117',
    color: '#e4e6eb',
    fontSize: '14px',
  },
  error: {
    backgroundColor: '#3a1a1c',
    color: '#ff8a8a',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '10px',
  },
  footerText: { fontSize: '13px', color: '#9199a8', marginTop: '18px', textAlign: 'center' },
  link: { color: '#5b8def', fontWeight: 600 },
};

export default Signup;