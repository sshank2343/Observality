const { z } = require('zod');

const createAlertRuleSchema = z.object({
  metric: z.enum(['latency', 'cost', 'error_rate', 'request_volume']),
  condition: z.enum(['gt', 'lt']),
  threshold: z.number(),
  channel: z.enum(['slack', 'email', 'webhook']),
  channelTarget: z.string().min(1), // slack webhook URL, email address, or webhook URL
});

module.exports = { createAlertRuleSchema };