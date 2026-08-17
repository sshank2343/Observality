const express = require('express');
const { requireAuth } = require('../../middleware/auth.middleware');
const { getProjectById } = require('../projects/project.service');
const { evaluate } = require('./eval.controller');

const router = express.Router();

router.use(requireAuth);

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

router.post('/:traceId', evaluate);

module.exports = router;