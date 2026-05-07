import dayjs from 'dayjs';
import { SERVER_URL } from '../config/env.js';
import transporter, { accountEmail } from '../config/nodemailer.js';
import { emailTemplates } from '../utils/email-template.js';

const supportedReminderDays = new Set([7, 5, 2, 1]);

const getReminderTemplate = (daysBefore) => {
  const normalizedDays = Number(daysBefore);

  if (!supportedReminderDays.has(normalizedDays)) {
    throw new Error(`Unsupported reminder cadence: ${daysBefore}`);
  }

  const template = emailTemplates.find((item) => item.daysBefore === normalizedDays);

  if (!template) {
    throw new Error(`Email template not found for ${normalizedDays}-day reminder`);
  }

  return template;
};

const buildFallbackLink = (path) => {
  if (!SERVER_URL) {
    return '#';
  }

  return `${SERVER_URL.replace(/\/$/, '')}${path}`;
};

export const sendReminderEmail = async ({ to, daysBefore, subscription }) => {
  if (!to) {
    throw new Error('Recipient email is required');
  }

  if (!subscription) {
    throw new Error('Subscription payload is required');
  }

  if (!accountEmail || accountEmail === 'no-reply@example.com') {
    throw new Error('Email sender is not configured');
  }

  const template = getReminderTemplate(daysBefore);
  const renewalDate = dayjs(subscription.renewalDate);

  if (!renewalDate.isValid()) {
    throw new Error('Invalid renewal date on subscription');
  }

  const recipientName = subscription.user?.name || subscription.user?.email || 'there';
  const mailInfo = {
    userName: recipientName,
    subscriptionName: subscription.name,
    renewalDate: renewalDate.format('MMMM D, YYYY'),
    planName: subscription.name,
    price: `${subscription.price} ${subscription.currency} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
    accountSettingsLink: buildFallbackLink('/account/subscriptions'),
    supportLink: buildFallbackLink('/support'),
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  return transporter.sendMail({
    from: accountEmail,
    to,
    subject,
    html: message,
    text: [
      `Hi ${recipientName},`,
      `${subscription.name} renews on ${mailInfo.renewalDate}.`,
      `Plan: ${mailInfo.planName}`,
      `Price: ${mailInfo.price}`,
      `Payment method: ${mailInfo.paymentMethod}`,
    ].join('\n'),
  });
};