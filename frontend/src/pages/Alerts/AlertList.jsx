import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useAlerts } from '../../hooks/useAlerts';
import AlertCard from '../../components/alerts/AlertCard';
import AlertRuleForm from './AlertRuleForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const AlertList = () => {
  const { selectedProjectId } = useProjects();
  const { rules, loading, error, createRule, deleteRule } = useAlerts(selectedProjectId);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = async (ruleData) => {
    await createRule(ruleData);
    setModalOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Alerts</h1>
        <Button onClick={() => setModalOpen(true)}>+ New Alert Rule</Button>
      </div>

      {error && <div style={{ color: '#ff8a8a', marginBottom: '12px' }}>{error}</div>}

      {rules.length === 0 ? (
        <div style={styles.empty}>
          No alert rules yet. Create one to get notified when metrics cross a threshold.
        </div>
      ) : (
        <div style={styles.card}>
          {rules.map((rule) => (
            <AlertCard key={rule.id} rule={rule} onDelete={deleteRule} />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Alert Rule">
        <AlertRuleForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '22px' },
  card: { backgroundColor: '#161822', border: '1px solid #2c2f3d', borderRadius: '10px', overflow: 'hidden' },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#9199a8' },
};

export default AlertList;