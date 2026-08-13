const { z } = require('zod');

// This is the canonical shape every trace must normalize into,
// regardless of whether it arrived via custom SDK or OTel.
const traceSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'gemini', 'local', 'other']),
  model: z.string().min(1),
  inputTokens: z.number().int().nonnegative().default(0),
  outputTokens: z.number().int().nonnegative().default(0),
  latencyMs: z.number().nonnegative(),
  costUsd: z.number().nonnegative().optional(), // computed server-side if omitted
  status: z.enum(['success', 'error']).default('success'),
  errorMessage: z.string().optional(),
  input: z.string().optional(),      // prompt text — optional for privacy
  output: z.string().optional(),     // response text — optional for privacy
  metadata: z.record(z.any()).optional(), // freeform tags (user_id, session_id, etc.)
  timestamp: z.string().datetime().optional(), // defaults to server time if omitted
});

module.exports = { traceSchema };