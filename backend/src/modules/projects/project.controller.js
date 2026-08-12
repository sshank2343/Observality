const {
  createProject,
  listProjects,
  createApiKeyForProject,
  revokeApiKey,
} = require('./project.service');
const { createProjectSchema } = require('../../schemas/project.schema');

const create = async (req, res, next) => {
  try {
    const data = createProjectSchema.parse(req.body);
    const project = await createProject({ name: data.name, orgId: req.user.orgId });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const projects = await listProjects({ orgId: req.user.orgId });
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
};

const createApiKey = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const result = await createApiKeyForProject({ projectId, orgId: req.user.orgId });
    // rawKey only ever appears in this one response — client must save it now
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteApiKey = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const result = await revokeApiKey({ keyId, orgId: req.user.orgId });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, list, createApiKey, deleteApiKey };