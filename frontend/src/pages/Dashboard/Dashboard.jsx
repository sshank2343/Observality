import { useProjects } from '../../hooks/useProjects';
import { useMetrics } from '../../hooks/useMetrics';
import SummaryCard from '../../components/common/SummaryCard';
import Spinner from '../../components/common/Spinner';
import RequestVolumeChart from '../../components/charts/RequestVolumeChart';
import LatencyChart from '../../components/charts/LatencyChart';
import CostChart from '../../components/charts/CostChart';

const Dashboard = () => {
  const { projects, loading: projectsLoading, selectedProjectId, createProject } = useProjects();
  const { summary, timeseries, loading: metricsLoading } = useMetrics(selectedProjectId);

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
      <h1 style={styles.title}>Dashboard</h1>
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
  title: { fontSize: '22px', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#9199a8', marginBottom: '24px' },
  cardsRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  chartCard: {
    backgroundColor: '#161822',
    border: '1px solid #2c2f3d',
    borderRadius: '10px',
    padding: '16px',
  },
  chartTitle: { fontSize: '13px', color: '#c1c5cd', marginBottom: '8px', fontWeight: 600 },
  emptyState: { textAlign: 'center', padding: '80px 20px' },
  createBtn: {
    backgroundColor: '#5b8def',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default Dashboard;