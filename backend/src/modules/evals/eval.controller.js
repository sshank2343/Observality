const { runEvalsForTrace } = require('./eval.service');

const evaluate = async (req, res, next) => {
  try {
    const trace = await runEvalsForTrace({
      traceId: req.params.traceId,
      projectId: req.query.projectId,
    });
    res.status(200).json(trace);
  } catch (err) {
    next(err);
  }
};

module.exports = { evaluate };