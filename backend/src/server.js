const app = require('./app');
const config = require('./config');
const { connectMongo } = require('./db/mongoose/connection');
const { redisClient } = require('./db/redis/connection');
const { prisma } = require('./config/postgres.config');
const { attachWebSocket } = require('./websocket');

const startServer = async () => {
  await connectMongo();
  await redisClient.ping();
  await prisma.$connect();

  const server = app.listen(config.port, () => {
    console.log(`Backend running on http://localhost:${config.port} [${config.nodeEnv}]`);
  });

  attachWebSocket(server);
  console.log('WebSocket server attached at /ws');

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