import { useCallback } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useMetrics } from '../../hooks/useMetrics';
import { useWebSocket } from '../../hooks/useWebSocket';
import SummaryCard from '../../components/common/SummaryCard';
import Spinner from '../../components/common/Spinner';
import RequestVolumeChart from '../../components/charts/RequestVolumeChart';
import LatencyChart from '../../components/charts/LatencyChart';
import CostChart from '../../components/charts/CostChart';

const Dashboard = () => {
  const { projects, loading: projectsLoading, selectedProjectId, createProject } = useProjects();
  const { summary, timeseries, loading: metricsLoading, refetch } = useMetrics(selectedProjectId);

  const handleWsMessage = useCallback(
    (event) => {
      // A new trace landed — refresh summary/timeseries so charts stay current.
      // Simple approach: refetch on every event. Fine at demo scale; could be
      // debounced/throttled later if trace volume gets very high.
      if (event.type === 'trace.created' && event.trace.projectId === selectedProjectId) {
        refetch();
      }
    },
    [selectedProjectId, refetch]
  );

  const { connected } = useWebSocket(handleWsMessage);

  if (projectsLoading) return <Spinner />;

  if (projects.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h2>No projects yet</h2>
        <p style={{ color: '#9199a8', marginBottom: '16px' }}>
          Create a project to start sending traces from the SDK.
        </p>
        <button
          style={styles.createBtn}
          onClick={() => {
            const name = prompt('Project name:');
            if (name) createProject(name);
          }}
        >
          + Create Project
        </button>
      </div>
    );
  }

  if (metricsLoading || !summary) return <Spinner />;

  return (
    <div>
      <div style={styles.titleRow}>
        <h1 style={styles.title}>Dashboard</h1>
        <span style={{ ...styles.liveDot, backgroundColor: connected ? '#4cd07d' : '#9199a8' }} />
        <span style={styles.liveLabel}>{connected ? 'Live' : 'Disconnected'}</span>
      </div>
      <p style={styles.subtitle}>Last 24 hours</p>

      <div style={styles.cardsRow}>
        <SummaryCard label="Requests" value={summary.requestCount} />
        <SummaryCard label="Avg Latency" value={summary.avgLatencyMs} suffix="ms" />
        <SummaryCard label="Total Cost" value={`$${summary.totalCostUsd.toFixed(4)}`} />
        <SummaryCard label="Error Rate" value={(summary.errorRate * 100).toFixed(1)} suffix="%" />
      </div>

      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Request Volume</h3>
          <RequestVolumeChart data={timeseries} />
        </div>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Average Latency</h3>
          <LatencyChart data={timeseries} />
        </div>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Cost</h3>
          <CostChart data={timeseries} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  titleRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  title: { fontSize: '22px' },
  liveDot: { width: '8px', height: '8px', borderRadius: '50%' },
  liveLabel: { fontSize: '12px', color: '#9199a8' },
  subtitle: { fontSize: '13px', color: '#9199a8', marginBottom: '24px', marginTop: '4px' },
  cardsRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  chartCard: { backgroundColor: '#161822', border: '1px solid #2c2f3d', borderRadius: '10px', padding: '16px' },
  chartTitle: { fontSize: '13px', color: '#c1c5cd', marginBottom: '8px', fontWeight: 600 },
  emptyState: { textAlign: 'center', padding: '80px 20px' },
  createBtn: { backgroundColor: '#5b8def', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
};

export default Dashboard;