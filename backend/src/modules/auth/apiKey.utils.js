const crypto = require('crypto');

const generateApiKey = () => {
    const rawKey = `obs_live_${crypto.randomBytes(24).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.slice(0,16)

    return { rawKey, keyHash, keyPrefix}
}

const hashApiKey = (rawKey) => {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
};

module.exports = { generateApiKey, hashApiKey };