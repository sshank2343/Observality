import { useEffect } from 'react';

const Toast = ({ message, onClose, duration = 2000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (!message) return null;

  return <div style={styles.toast}>{message}</div>;
};

const styles = {
  toast: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1f2230',
    border: '1px solid #2c2f3d',
    color: '#e4e6eb',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    zIndex: 200,
  },
};

export default Toast;