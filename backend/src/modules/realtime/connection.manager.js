// Tracks active WebSocket connections per org, so we know who to push events to.
const orgConnections = new Map(); // orgId -> Set of ws connections

const addConnection = (orgId, ws) => {
  if (!orgConnections.has(orgId)) {
    orgConnections.set(orgId, new Set());
  }
  orgConnections.get(orgId).add(ws);
};

const removeConnection = (orgId, ws) => {
  const conns = orgConnections.get(orgId);
  if (!conns) return;
  conns.delete(ws);
  if (conns.size === 0) {
    orgConnections.delete(orgId);
  }
};

const broadcastToOrg = (orgId, data) => {
  const conns = orgConnections.get(orgId);
  if (!conns) return;

  const payload = JSON.stringify(data);
  conns.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(payload);
    }
  });
};

module.exports = { addConnection, removeConnection, broadcastToOrg };