const express = require('express');
const { requireApiKey } = require('../../middleware/apiKey.middleware');
const { receiveTrace } = require('./ingestion.controller');

const router = express.Router();

// SDK-facing — authenticated via API key, not JWT
router.post('/', requireApiKey, receiveTrace);

module.exports = router;