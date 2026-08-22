const Spinner = () => (
  <div style={styles.wrapper}>
    <div style={styles.spinner} />
  </div>
);

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', padding: '40px' },
  spinner: {
    width: '28px',
    height: '28px',
    border: '3px solid #2c2f3d',
    borderTopColor: '#5b8def',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

// Inject the keyframes once, globally
if (typeof document !== 'undefined' && !document.getElementById('spinner-keyframes')) {
  const style = document.createElement('style');
  style.id = 'spinner-keyframes';
  style.innerHTML = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}

export default Spinner;