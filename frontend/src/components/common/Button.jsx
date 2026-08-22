const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, fullWidth = false }) => {
  const styles = {
    base: {
      padding: '10px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 600,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      transition: 'opacity 0.15s ease',
    },
    primary: { backgroundColor: '#5b8def', color: '#fff' },
    secondary: { backgroundColor: '#1f2230', color: '#e4e6eb', border: '1px solid #2c2f3d' },
    danger: { backgroundColor: '#e5484d', color: '#fff' },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...styles.base, ...styles[variant] }}
    >
      {children}
    </button>
  );
};

export default Button;