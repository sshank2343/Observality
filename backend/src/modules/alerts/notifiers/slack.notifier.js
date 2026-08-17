const sendSlackAlert = async ({ webhookUrl, message }) => {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });

  if (!res.ok) {
    throw new Error(`Slack notification failed: ${res.status}`);
  }
};

module.exports = { sendSlackAlert };