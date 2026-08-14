const {
  redisPublisher,
  redisSubscriber,
} = require("../../db/redis/connection");

const CHANNEL_PREFIX = "org";

const getChannelName = (orgId) => `${CHANNEL_PREFIX}:${orgId}:events`;

const publishEvent = async (orgId, event) => {
  const channel = getChannelName(orgId);
  await redisPublisher.publish(channel, JSON.stringify(event));
};

// Tracks which orgId each subscription callback belongs to,
// so multiple WebSocket connections can share one Redis subscriber.
const subscriberCallbacks = new Map();

const subscribeToOrg = (orgId, callback) => {
  const channel = getChannelName(orgId);

  if (!subscriberCallbacks.has(channel)) {
    subscriberCallbacks.set(channel, new Set());
    redisSubscriber.subscribe(channel);
  }
  subscriberCallbacks.get(channel).add(callback);

  // Return an unsubscribe function
  return () => {
    const callbacks = subscriberCallbacks.get(channel);
    if (!callbacks) return;
    callbacks.delete(callback);
    if (callbacks.size === 0) {
      subscriberCallbacks.delete(channel);
      redisSubscriber.unsubscribe(channel);
    }
  };
};

// Single 'message' listener dispatches to all registered callbacks for that channel
redisSubscriber.on('message', (channel, message) => {
  const callbacks = subscriberCallbacks.get(channel);
  if (!callbacks) return;

  let parsed;
  try {
    parsed = JSON.parse(message);
  } catch {
    return;
  }

  callbacks.forEach((cb) => cb(parsed));
});

module.exports = { publishEvent, subscribeToOrg };