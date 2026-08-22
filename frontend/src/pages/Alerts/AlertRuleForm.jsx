import { useState } from 'react';
import Button from '../../components/common/Button';

const AlertRuleForm = ({ onSubmit, onCancel }) => {
  const [metric, setMetric] = useState('latency');
  const [condition, setCondition] = useState('gt');
  const [threshold, setThreshold] = useState('');
  const [channel, setChannel] = useState('webhook');
  const [channelTarget, setChannelTarget] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        metric,
        condition,
        threshold: Number(threshold),
        channel,
        channelTarget,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={styles.label}>Metric</label>
      <select style={styles.input} value={metric} onChange={(e) => setMetric(e.target.value)}>
        <option value="latency">Latency (ms)</option>
        <option value="cost">Cost (USD)</option>
        <option value="error_rate">Error Rate</option>
        <option value="request_volume">Request Volume</option>
      </select>

      <label style={styles.label}>Condition</label>
      <select style={styles.input} value={condition} onChange={(e) => setCondition(e.target.value)}>
        <option value="gt">Greater than</option>
        <option value="lt">Less than</option>
      </select>

      <label style={styles.label}>Threshold</label>
      <input
        style={styles.input}
        type="number"
        step="any"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        required
      />

      <label style={styles.label}>Notification channel</label>
      <select style={styles.input} value={channel} onChange={(e) => setChannel(e.target.value)}>
        <option value="webhook">Webhook</option>
        <option value="slack">Slack</option>
        <option value="email">Email</option>
      </select>

      <label style={styles.label}>
        {channel === 'email' ? 'Email address' : 'Webhook URL'}
      </label>
      <input
        style={styles.input}
        type="text"
        value={channelTarget}
        onChange={(e) => setChannelTarget(e.target.value)}
        placeholder={channel === 'email' ? 'you@example.com' : 'https://...'}
        required
      />

      <div style={styles.actions}>
        <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Rule'}</Button>
      </div>
    </form>
  );
};

const styles = {
  label: { display: 'block', fontSize: '13px', marginBottom: '6px', marginTop: '12px', color: '#c1c5cd' },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '6px',
    border: '1px solid #2c2f3d',
    backgroundColor: '#0f1117',
    color: '#e4e6eb',
    fontSize: '13px',
  },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
};

export default AlertRuleForm;