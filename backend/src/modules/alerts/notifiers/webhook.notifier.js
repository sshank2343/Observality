const sendWebhookAlert = async ({ webhookUrl, payload }) => {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Webhook notification failed: ${res.status}`);
  }
};

module.exports = { sendWebhookAlert };