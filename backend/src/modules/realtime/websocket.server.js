const { WebSocketServer } = require('ws');
const { verifyToken } = require('../auth/jwt.utils');
const { subscribeToOrg } = require('./pubsub.service');
const { addConnection, removeConnection, broadcastToOrg } = require('./connection.manager');

const setupWebSocketServer = (httpServer) => {
  const wss = new WebSocketServer({ noServer: true });

  // Handle the HTTP -> WebSocket upgrade manually so we can auth via query param token
  httpServer.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname !== '/ws') {
      socket.destroy();
      return;
    }

    const token = url.searchParams.get('token');
    if (!token) {
      socket.destroy();
      return;
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.orgId = decoded.orgId;
      wss.emit('connection', ws, req);
    });
  });

  wss.on('connection', (ws) => {
    const { orgId } = ws;
    addConnection(orgId, ws);

    // Bridge Redis pub/sub events -> this connection's org room
    const unsubscribe = subscribeToOrg(orgId, (event) => {
      broadcastToOrg(orgId, event);
    });

    ws.on('close', () => {
      removeConnection(orgId, ws);
      unsubscribe();
    });

    ws.on('error', () => {
      removeConnection(orgId, ws);
      unsubscribe();
    });

    ws.send(JSON.stringify({ type: 'connected', message: 'Real-time connection established' }));
  });

  return wss;
};

module.exports = { setupWebSocketServer };