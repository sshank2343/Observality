import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useTraceDetail } from '../../hooks/useTraceDetail';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import { formatDate, formatCost, formatLatency } from '../../utils/formatters';

const EvalScore = ({ label, evalData }) => {
  if (!evalData || evalData.score === null || evalData.score === undefined) {
    return (
      <div style={styles.evalBox}>
        <div style={styles.evalLabel}>{label}</div>
        <div style={styles.evalNotRun}>Not evaluated</div>
      </div>
    );
  }

  const score = evalData.score;
  const color = score > 0.6 ? '#ff8a8a' : score > 0.3 ? '#f5a623' : '#4cd07d';

  return (
    <div style={styles.evalBox}>
      <div style={styles.evalLabel}>{label}</div>
      <div style={{ ...styles.evalScore, color }}>{(score * 100).toFixed(0)}%</div>
      {evalData.reasoning && <div style={styles.evalReasoning}>{evalData.reasoning}</div>}
    </div>
  );
};

const TraceDetail = () => {
  const { traceId } = useParams();
  const navigate = useNavigate();
  const { selectedProjectId } = useProjects();
  const { trace, loading, error, evaluating, runEval } = useTraceDetail(traceId, selectedProjectId);

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: '#ff8a8a' }}>{error}</div>;
  if (!trace) return null;

  return (
    <div>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back to traces</button>

      <div style={styles.headerRow}>
        <h1 style={styles.title}>{trace.model}</h1>
        <span style={styles.provider}>{trace.provider}</span>
      </div>
      <div style={styles.timestamp}>{formatDate(trace.createdAt)}</div>

      <div style={styles.statsRow}>
        <div style={styles.statBox}><div style={styles.statLabel}>Status</div><div>{trace.status}</div></div>
        <div style={styles.statBox}><div style={styles.statLabel}>Latency</div><div>{formatLatency(trace.latencyMs)}</div></div>
        <div style={styles.statBox}><div style={styles.statLabel}>Cost</div><div>{formatCost(trace.costUsd)}</div></div>
        <div style={styles.statBox}><div style={styles.statLabel}>Input Tokens</div><div>{trace.inputTokens}</div></div>
        <div style={styles.statBox}><div style={styles.statLabel}>Output Tokens</div><div>{trace.outputTokens}</div></div>
      </div>

      {trace.input && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Input</h3>
          <div style={styles.textBlock}>{trace.input}</div>
        </div>
      )}

      {trace.output && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Output</h3>
          <div style={styles.textBlock}>{trace.output}</div>
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.evalHeader}>
          <h3 style={styles.sectionTitle}>Quality Evaluation</h3>
          <Button onClick={runEval} disabled={evaluating || !trace.output}>
            {evaluating ? 'Evaluating...' : 'Run Evaluation'}
          </Button>
        </div>
        <div style={styles.evalGrid}>
          <EvalScore label="Hallucination" evalData={trace.evals?.hallucination} />
          <EvalScore label="Relevance" evalData={trace.evals?.relevance} />
          <EvalScore label="Toxicity" evalData={trace.evals?.toxicity} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  backBtn: { background: 'none', border: 'none', color: '#5b8def', fontSize: '13px', cursor: 'pointer', marginBottom: '16px', padding: 0 },
  headerRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  title: { fontSize: '22px' },
  provider: { fontSize: '12px', color: '#9199a8', textTransform: 'uppercase', backgroundColor: '#1f2230', padding: '3px 8px', borderRadius: '10px' },
  timestamp: { fontSize: '13px', color: '#9199a8', marginBottom: '20px' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '24px' },
  statBox: { backgroundColor: '#161822', border: '1px solid #2c2f3d', borderRadius: '8px', padding: '12px 16px', flex: 1 },
  statLabel: { fontSize: '11px', color: '#9199a8', marginBottom: '4px', textTransform: 'uppercase' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '14px', marginBottom: '8px', color: '#c1c5cd' },
  textBlock: { backgroundColor: '#161822', border: '1px solid #2c2f3d', borderRadius: '8px', padding: '14px', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap' },
  evalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  evalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' },
  evalBox: { backgroundColor: '#161822', border: '1px solid #2c2f3d', borderRadius: '8px', padding: '14px' },
  evalLabel: { fontSize: '12px', color: '#9199a8', marginBottom: '6px' },
  evalScore: { fontSize: '22px', fontWeight: 700 },
  evalNotRun: { fontSize: '13px', color: '#9199a8' },
  evalReasoning: { fontSize: '12px', color: '#9199a8', marginTop: '6px' },
};

export default TraceDetail;