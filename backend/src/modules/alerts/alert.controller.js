const { createAlertRule, listAlertRules, deleteAlertRule } = require('./alert.service');
const { createAlertRuleSchema } = require('../../schemas/alert.schema');

const create = async (req, res, next) => {
  try {
    const data = createAlertRuleSchema.parse(req.body);
    const rule = await createAlertRule({ projectId: req.query.projectId, ...data });
    res.status(201).json(rule);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const rules = await listAlertRules({ projectId: req.query.projectId });
    res.status(200).json(rules);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await deleteAlertRule({
      ruleId: req.params.ruleId,
      projectId: req.query.projectId,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, list, remove };