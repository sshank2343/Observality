// Stub for now — plug in a real provider (SendGrid, Resend, SES) when ready.
// Kept here so the notifier interface is consistent across channels.
const sendEmailAlert = async ({ to, subject, message }) => {
  console.log(`[EMAIL STUB] To: ${to} | Subject: ${subject} | Message: ${message}`);
  // TODO: integrate real email provider, e.g.:
  await resend.emails.send({ to, subject, text: message, from: 'shashankverma2343@gmail.com' });
};

module.exports = { sendEmailAlert };