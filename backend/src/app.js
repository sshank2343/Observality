const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// obs_live_8fb63ff7271bf4f4f9ba960f047b5e732cc76112fb4595cf
//.\venv\Scripts\Activate
const config = require('./config');
const healthRoutes = require('./modules/health/health.routes');
const authRoutes = require('./modules/auth/auth.routes');
const projectRoutes = require('./modules/projects/project.routes');
const ingestionRoutes = require('./modules/ingestion/ingestion.routes');
const traceRoutes = require('./modules/traces/trace.routes');
const metricsRoutes = require('./modules/metrics/metrics.routes');
const alertRoutes = require('./modules/alerts/alert.routes');
const evalRoutes = require('./modules/evals/eval.routes');
const { errorHandler } = require('./middleware/errorHandler.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/traces', ingestionRoutes);
app.use('/api/traces', traceRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/evals', evalRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

module.exports = app;