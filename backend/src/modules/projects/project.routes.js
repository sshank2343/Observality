const express = require('express');
const { requireAuth } = require('../../middleware/auth.middleware');
const { create, list, createApiKey, deleteApiKey } = require('./project.controller');

const router = express.Router();

router.use(requireAuth);

router.post('/', create);
router.get('/', list);
router.post('/:projectId/api-keys', createApiKey);
router.delete('/api-keys/:keyId', deleteApiKey);

module.exports = router;