const { prisma } = require('../../config/postgres.config');

const createAlertRule = async ({ projectId, ...data }) => {
  return prisma.alertRule.create({
    data: { projectId, ...data },
  });
};

const listAlertRules = async ({ projectId }) => {
  return prisma.alertRule.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });
};

const deleteAlertRule = async ({ ruleId, projectId }) => {
  const rule = await prisma.alertRule.findFirst({ where: { id: ruleId, projectId } });
  if (!rule) {
    const err = new Error('Alert rule not found');
    err.status = 404;
    throw err;
  }
  await prisma.alertRule.delete({ where: { id: ruleId } });
  return { deleted: true };
};

module.exports = { createAlertRule, listAlertRules, deleteAlertRule };