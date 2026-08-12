const app = require('./app');
const config = require('./config');
const { connectMongo } = require('./db/mongoose/connection');
const { redisClient } = require('./db/redis/connection');
const { prisma } = require('./config/postgres.config');

const startServer = async () => {
  await connectMongo();

  // Confirm Redis and Postgres are reachable before accepting traffic
  await redisClient.ping();
  await prisma.$connect();
//   console.log("Prisma Connected")

  const server = app.listen(config.port, () => {
    console.log(`Backend running on http://localhost:${config.port} [${config.nodeEnv}]`);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    redisClient.disconnect();
    server.close(() => process.exit(0));
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});