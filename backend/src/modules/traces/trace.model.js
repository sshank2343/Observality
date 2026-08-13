const mongoose = require("mongoose");

const traceSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    index: true,
  },
  orgId: {
    type: String,
    required: true,
    index: true,
  },

  provider: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },

  inputTokens: {
    type: Number,
    default: 0,
  },
  outputTokens: { type: Number, default: 0 },
  latencyMs: {
    type: Number,
    required: true,
  },
  costUsd: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["success", "error"],
    default: "success",
  },
  errorMessage: {
    type: String,
  },

  input: {
    type: String,
  },
  output: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL: auto-delete raw traces after 30 days (retention policy from our plan)
traceSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

// Compound index for the most common query pattern: "traces for project X, most recent first"
traceSchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model("Trace", traceSchema);
