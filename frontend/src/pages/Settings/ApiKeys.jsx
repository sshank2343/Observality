import { useState } from 'react';
import { useApiKeys } from '../../hooks/useApiKeys';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';

const ApiKeys = () => {
  const { apiKeys, selectedProject, creating, newKey, error, generateKey, revokeKey, dismissNewKey } = useApiKeys();
  const [toastMsg, setToastMsg] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToastMsg('Copied to clipboard');
  };

  if (!selectedProject) {
    return <div style={styles.empty}>Select or create a project first (from the Dashboard).</div>;
  }

  return (
    <div>
      <h1 style={styles.title}>API Keys</h1>
      <p style={styles.subtitle}>
        Project: <strong>{selectedProject.name}</strong> — use these keys with the SDK's <code>obs.init(api_key=...)</code>
      </p>

      {error && <div style={{ color: '#ff8a8a', marginBottom: '12px' }}>{error}</div>}

      {newKey && (
        <div style={styles.newKeyBanner}>
          <div style={styles.newKeyLabel}>
            New key generated — copy it now, you won't be able to see it again:
          </div>
          <div style={styles.newKeyRow}>
            <code style={styles.newKeyValue}>{newKey.rawKey}</code>
            <Button onClick={() => copyToClipboard(newKey.rawKey)}>Copy</Button>
          </div>
          <button style={styles.dismissBtn} onClick={dismissNewKey}>Dismiss</button>
        </div>
      )}

      <div style={styles.actionsRow}>
        <Button onClick={generateKey} disabled={creating}>
          {creating ? 'Generating...' : '+ Generate New API Key'}
        </Button>
      </div>

      {apiKeys.length === 0 ? (
        <div style={styles.empty}>No API keys yet for this project.</div>
      ) : (
        <div style={styles.card}>
          {apiKeys.map((key) => (
            <div key={key.id} style={styles.keyRow}>
              <code style={styles.keyPrefix}>{key.keyPrefix}...</code>
              <span style={styles.keyDate}>Created {formatDate(key.createdAt)}</span>
              <button style={styles.revokeBtn} onClick={() => revokeKey(key.id)}>Revoke</button>
            </div>
          ))}
        </div>
      )}

      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
    </div>
  );
};

const styles = {
  title: { fontSize: '22px', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#9199a8', marginBottom: '20px' },
  actionsRow: { marginBottom: '20px' },
  newKeyBanner: {
    backgroundColor: '#173a24',
    border: '1px solid #2c5a3a',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
  },
  newKeyLabel: { fontSize: '13px', color: '#4cd07d', marginBottom: '10px', fontWeight: 600 },
  newKeyRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  newKeyValue: {
    flex: 1,
    backgroundColor: '#0f1117',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#e4e6eb',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
  },
  dismissBtn: { background: 'none', border: 'none', color: '#9199a8', fontSize: '12px', cursor: 'pointer', marginTop: '10px' },
  card: { backgroundColor: '#161822', border: '1px solid #2c2f3d', borderRadius: '10px', overflow: 'hidden' },
  keyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 16px',
    borderBottom: '1px solid #2c2f3d',
  },
  keyPrefix: { fontSize: '13px', color: '#e4e6eb', flex: 1 },
  keyDate: { fontSize: '12px', color: '#9199a8' },
  revokeBtn: { background: 'none', border: 'none', color: '#ff8a8a', fontSize: '12px', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#9199a8' },
};

export default ApiKeys;