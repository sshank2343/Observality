const mongoose = require('mongoose');

const traceSchema = new mongoose.Schema({
  projectId: { type: String, required: true, index: true },
  orgId: { type: String, required: true, index: true },

  provider: { type: String, required: true },
  model: { type: String, required: true },

  inputTokens: { type: Number, default: 0 },
  outputTokens: { type: Number, default: 0 },
  latencyMs: { type: Number, required: true },
  costUsd: { type: Number, default: 0 },

  status: { type: String, enum: ['success', 'error'], default: 'success' },
  errorMessage: { type: String },

  input: { type: String },
  output: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },

  // Eval scores — populated asynchronously after ingestion, null until evaluated
  evals: {
    hallucination: {
      score: { type: Number, default: null },
      reasoning: { type: String },
    },
    relevance: {
      score: { type: Number, default: null },
      reasoning: { type: String },
    },
    toxicity: {
      score: { type: Number, default: null },
      reasoning: { type: String },
    },
    evaluatedAt: { type: Date, default: null },
  },

  createdAt: { type: Date, default: Date.now, index: true },
});

traceSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });
traceSchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model('Trace', traceSchema);