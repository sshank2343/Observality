const { listTraces, getTraceById } = require('./trace.service');

const list = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const result = await listTraces({
      projectId: req.query.projectId,
      page,
      limit,
      status,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const trace = await getTraceById({
      traceId: req.params.traceId,
      projectId: req.query.projectId,
    });
    res.status(200).json(trace);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne };