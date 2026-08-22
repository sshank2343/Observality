export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatCost = (value) => `$${Number(value).toFixed(5)}`;

export const formatLatency = (ms) => `${Math.round(ms)}ms`;

export const truncate = (text, maxLength = 60) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};