require('dotenv').config();

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',

  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  judgeModel: process.env.JUDGE_MODEL || 'claude-haiku-4-5-20251001',
};

const requiredVars = ['mongoUri', 'redisUrl', 'databaseUrl', 'jwtSecret'];
const missing = requiredVars.filter((key) => !config[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = config;