const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');
const healthRoutes = require('./modules/health/health.routes');
const authRoutes = require('./modules/auth/auth.routes');
const projectRoutes = require('./modules/projects/project.routes');
const ingestionRoutes = require('./modules/ingestion/ingestion.routes');
const traceRoutes = require('./modules/traces/trace.routes');
const metricsRoutes = require('./modules/metrics/metrics.routes');
const { errorHandler } = require('./middleware/errorHandler.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/traces', ingestionRoutes);   // POST / — SDK ingestion (API key auth)
app.use('/api/traces', traceRoutes);        // GET /, GET /:id — dashboard reads (JWT auth)
app.use('/api/metrics', metricsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

module.exports = app;