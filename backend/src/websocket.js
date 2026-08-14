const { setupWebSocketServer } = require('./modules/realtime/websocket.server');

const attachWebSocket = (httpServer) => {
  return setupWebSocketServer(httpServer);
};

module.exports = { attachWebSocket };