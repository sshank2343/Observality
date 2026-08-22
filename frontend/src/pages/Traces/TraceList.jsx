import { useState, useCallback } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTraces } from '../../hooks/useTraces';
import { useWebSocket } from '../../hooks/useWebSocket';
import TraceCard from '../../components/traces/TraceCard';
import Pagination from '../../components/common/Table';
import Spinner from '../../components/common/Spinner';

const TraceList = () => {
  const { selectedProjectId } = useProjects();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [liveTraces, setLiveTraces] = useState([]);

  const { traces, pagination, loading, error } = useTraces(selectedProjectId, { page, limit: 25, status: status || undefined });

  const handleWsMessage = useCallback(
    (event) => {
      if (event.type === 'trace.created' && event.trace.projectId === selectedProjectId && page === 1) {
        // Prepend new trace, avoid duplicates if it somehow arrives twice
        setLiveTraces((prev) => {
          if (prev.some((t) => t._id === event.trace.id)) return prev;
          return [{ ...event.trace, _id: event.trace.id }, ...prev];
        });
      }
    },
    [selectedProjectId, page]
  );

  const { connected } = useWebSocket(handleWsMessage);

  // Reset live buffer when filters/page change, so we don't show stale live traces
  // mixed with a freshly filtered fetch
  const displayedTraces = page === 1 && !status ? [...liveTraces, ...traces].slice(0, 25) : traces;

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: '#ff8a8a' }}>{error}</div>;

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <h1 style={styles.title}>Traces</h1>
          <span style={{ ...styles.liveDot, backgroundColor: connected ? '#4cd07d' : '#9199a8' }} />
          <span style={styles.liveLabel}>{connected ? 'Live' : 'Disconnected'}</span>
        </div>
        <select
          style={styles.filter}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
            setLiveTraces([]);
          }}
        >
          <option value="">All statuses</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
        </select>
      </div>

      {displayedTraces.length === 0 ? (
        <div style={styles.empty}>No traces yet. Send some data via the SDK to see them here.</div>
      ) : (
        <div style={styles.card}>
          {displayedTraces.map((trace) => (
            <TraceCard key={trace._id} trace={trace} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={(p) => { setPage(p); setLiveTraces([]); }} />
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  titleRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  title: { fontSize: '22px' },
  liveDot: { width: '8px', height: '8px', borderRadius: '50%' },
  liveLabel: { fontSize: '12px', color: '#9199a8' },
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