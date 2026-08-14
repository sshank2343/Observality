const { getSummaryMetrics, getTimeSeriesMetrics } = require('./metrics.service');

const summary = async (req, res, next) => {
  try {
    const data = await getSummaryMetrics({
      projectId: req.query.projectId,
      since: req.query.since,
    });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const timeseries = async (req, res, next) => {
  try {
    const data = await getTimeSeriesMetrics({
      projectId: req.query.projectId,
      since: req.query.since,
    });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { summary, timeseries };