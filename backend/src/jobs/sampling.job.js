// Determines whether a given trace should be stored at full detail or sampled out.
// Used at ingestion time — errors and slow requests are always kept in full;
// normal successful requests are sampled at a configurable rate.

const DEFAULT_SAMPLE_RATE = 1.0; // 1.0 = store 100% for now; lower once volume grows

const shouldStoreFullTrace = ({ status, latencyMs, sampleRate = DEFAULT_SAMPLE_RATE }) => {
  const SLOW_THRESHOLD_MS = 5000;

  // Always keep errors and slow requests in full detail
  if (status === 'error' || latencyMs > SLOW_THRESHOLD_MS) {
    return true;
  }

  return Math.random() < sampleRate;
};

module.exports = { shouldStoreFullTrace };