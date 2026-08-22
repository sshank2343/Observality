import AlertBadge from './AlertBadge';

const conditionLabel = { gt: '>', lt: '<' };

const AlertCard = ({ rule, onDelete }) => {
  return (
    <div style={styles.card}>
      <div style={styles.left}>
        <AlertBadge metric={rule.metric} />
        <span style={styles.condition}>
          {conditionLabel[rule.condition]} {rule.threshold}
        </span>
        <span style={styles.channel}>via {rule.channel}</span>
      </div>
      <button style={styles.deleteBtn} onClick={() => onDelete(rule.id)}>Delete</button>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid #2c2f3d',
  },
  left: { display: 'flex', alignItems: 'center', gap: '10px' },
  condition: { fontSize: '13px', color: '#e4e6eb', fontWeight: 600 },
  channel: { fontSize: '12px', color: '#9199a8' },
  deleteBtn: { background: 'none', border: 'none', color: '#ff8a8a', fontSize: '12px', cursor: 'pointer' },
};

export default AlertCard;