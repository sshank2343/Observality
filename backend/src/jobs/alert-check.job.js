const { prisma } = require('../config/postgres.config');
const { evaluateRule } = require('../modules/alerts/anomaly-detector');
const { sendSlackAlert } = require('../modules/alerts/notifiers/slack.notifier');
const { sendWebhookAlert } = require('../modules/alerts/notifiers/webhook.notifier');
const { sendEmailAlert } = require('../modules/alerts/notifiers/email.notifier');
const { createQueue, createWorker, QUEUE_NAMES } = require('./queue.config');

const dispatchNotification = async (rule, evaluation) => {
  const message = `Alert: ${rule.metric} ${rule.condition === 'gt' ? 'exceeded' : 'dropped below'} threshold ${rule.threshold} (current: ${evaluation.value})`;

  try {
    if (rule.channel === 'slack') {
      await sendSlackAlert({ webhookUrl: rule.channelTarget, message });
    } else if (rule.channel === 'webhook') {
      await sendWebhookAlert({
        webhookUrl: rule.channelTarget,
        payload: { rule, evaluation, message },
      });
    } else if (rule.channel === 'email') {
      await sendEmailAlert({ to: rule.channelTarget, subject: 'Observability Alert', message });
    }
  } catch (err) {
    console.error(`Failed to dispatch alert for rule ${rule.id}:`, err.message);
  }
};

// Checks the most recent hourly metric for every project against its alert rules.
const runAlertCheck = async () => {
  const rules = await prisma.alertRule.findMany();

  for (const rule of rules) {
    const latestMetric = await prisma.hourlyMetric.findFirst({
      where: { projectId: rule.projectId },
      orderBy: { hour: 'desc' },
    });

    if (!latestMetric) continue;

    const evaluation = evaluateRule(rule, latestMetric);

    if (evaluation.breached) {
      await dispatchNotification(rule, evaluation);
    }
  }

  console.log(`Alert check complete — evaluated ${rules.length} rule(s)`);
};

const alertCheckQueue = createQueue(QUEUE_NAMES.ALERT_CHECK);

const startAlertCheckWorker = () => {
  createWorker(QUEUE_NAMES.ALERT_CHECK, async () => {
    await runAlertCheck();
  });
};

module.exports = { alertCheckQueue, startAlertCheckWorker, runAlertCheck };