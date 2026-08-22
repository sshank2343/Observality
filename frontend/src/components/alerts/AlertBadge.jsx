const AlertBadge = ({ metric }) => {
  const labels = {
    latency: 'Latency',
    cost: 'Cost',
    error_rate: 'Error Rate',
    request_volume: 'Request Volume',
  };

  return <span style={styles.badge}>{labels[metric] || metric}</span>;
};

const styles = {
  badge: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: '10px',
    backgroundColor: '#1f2230',
    color: '#c1c5cd',
  },
};

export default AlertBadge;