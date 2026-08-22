// Simple pagination footer, reused across list pages
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div style={styles.wrapper}>
      <button
        style={styles.btn}
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Previous
      </button>
      <span style={styles.text}>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        style={styles.btn}
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </button>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '16px' },
  btn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #2c2f3d',
    backgroundColor: '#161822',
    color: '#e4e6eb',
    fontSize: '13px',
    cursor: 'pointer',
  },
  text: { fontSize: '13px', color: '#9199a8' },
};

export default Pagination;