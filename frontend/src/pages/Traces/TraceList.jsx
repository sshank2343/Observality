import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTraces } from '../../hooks/useTraces';
import TraceCard from '../../components/traces/TraceCard';
import Pagination from '../../components/common/Table';
import Spinner from '../../components/common/Spinner';

const TraceList = () => {
  const { selectedProjectId } = useProjects();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { traces, pagination, loading, error } = useTraces(selectedProjectId, { page, limit: 25, status: status || undefined });

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: '#ff8a8a' }}>{error}</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Traces</h1>
        <select
          style={styles.filter}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
        </select>
      </div>

      {traces.length === 0 ? (
        <div style={styles.empty}>No traces yet. Send some data via the SDK to see them here.</div>
      ) : (
        <div style={styles.card}>
          {traces.map((trace) => (
            <TraceCard key={trace._id} trace={trace} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '22px' },
  filter: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #2c2f3d',
    backgroundColor: '#161822',
    color: '#e4e6eb',
    fontSize: '13px',
  },
  card: { backgroundColor: '#161822', border: '1px solid #2c2f3d', borderRadius: '10px', overflow: 'hidden' },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#9199a8' },
};

export default TraceList;