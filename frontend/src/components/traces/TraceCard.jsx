import { useNavigate } from 'react-router-dom';
import { traceDetailPath } from '../../constants/routes';
import { formatDate, formatCost, formatLatency, truncate } from '../../utils/formatters';

const providerColors = {
  openai: '#4cd07d',
  anthropic: '#d97757',
  gemini: '#5b8def',
  local: '#9199a8',
  other: '#9199a8',
};

const TraceCard = ({ trace }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.row} onClick={() => navigate(traceDetailPath(trace._id))}>
      <span style={{ ...styles.providerDot, backgroundColor: providerColors[trace.provider] || '#9199a8' }} />

      <div style={styles.mainCol}>
        <div style={styles.modelLine}>
          <span style={styles.model}>{trace.model}</span>
          <span style={styles.provider}>{trace.provider}</span>
        </div>
        {trace.input && <div style={styles.inputPreview}>{truncate(trace.input, 80)}</div>}
      </div>

      <div style={styles.statCol}>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: trace.status === 'error' ? '#3a1a1c' : '#173a24',
            color: trace.status === 'error' ? '#ff8a8a' : '#4cd07d',
          }}
        >
          {trace.status}
        </span>
      </div>

      <div style={styles.statCol}>{formatLatency(trace.latencyMs)}</div>
      <div style={styles.statCol}>{formatCost(trace.costUsd)}</div>
      <div style={styles.timeCol}>{formatDate(trace.createdAt)}</div>
    </div>
  );
};

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #2c2f3d',
    cursor: 'pointer',
    gap: '12px',
  },
  providerDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  mainCol: { flex: 1, minWidth: 0 },
  modelLine: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' },
  model: { fontSize: '14px', fontWeight: 600, color: '#e4e6eb' },
  provider: { fontSize: '11px', color: '#9199a8', textTransform: 'uppercase' },
  inputPreview: { fontSize: '12px', color: '#9199a8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  statCol: { width: '90px', fontSize: '13px', color: '#c1c5cd' },
  statusBadge: { fontSize: '11px', padding: '3px 8px', borderRadius: '10px', fontWeight: 600 },
  timeCol: { width: '140px', fontSize: '12px', color: '#9199a8', textAlign: 'right' },
};

export default TraceCard;