const express = require('express');
const { requireAuth } = require('../../middleware/auth.middleware');
const { getProjectById } = require('../projects/project.service');
const { list, getOne } = require('./trace.controller');

const router = express.Router();

router.use(requireAuth);

// Verify the requested project actually belongs to the logged-in user's org
const verifyProjectAccess = async (req, res, next) => {
  try {
    if (!req.query.projectId) {
      return res.status(400).json({ error: 'projectId query param is required' });
    }
    await getProjectById({ projectId: req.query.projectId, orgId: req.user.orgId });
    next();
  } catch (err) {
    next(err);
  }
};

router.use(verifyProjectAccess);

router.get('/', list);
router.get('/:traceId', getOne);

module.exports = router;