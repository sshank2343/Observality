const SummaryCard = ({ label, value, suffix = '' }) => (
  <div style={styles.card}>
    <div style={styles.label}>{label}</div>
    <div style={styles.value}>
      {value}
      {suffix && <span style={styles.suffix}>{suffix}</span>}
    </div>
  </div>
);

const styles = {
  card: {
    backgroundColor: '#161822',
    border: '1px solid #2c2f3d',
    borderRadius: '10px',
    padding: '18px 20px',
    flex: 1,
  },
  label: { fontSize: '12px', color: '#9199a8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.03em' },
  value: { fontSize: '26px', fontWeight: 700, color: '#e4e6eb' },
  suffix: { fontSize: '14px', color: '#9199a8', marginLeft: '4px', fontWeight: 400 },
};

export default SummaryCard;