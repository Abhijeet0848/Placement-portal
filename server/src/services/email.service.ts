import nodemailer from 'nodemailer';
import logger from '../utils/logger';

const SMTP_HOST = process.env.SMTP_HOST || process.env.EMAIL_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

let transporter: nodemailer.Transporter | null = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    logger.info('Initialized SMTP Mail Transporter successfully.');
  } catch (error: any) {
    logger.error(`Error initializing SMTP mail transporter: ${error?.message || error}`);
  }
} else {
  logger.warn('SMTP Credentials missing. Email notifications will be logged to console in development mode.');
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${process.env.APP_NAME || 'Smart Placement Portal'}" <noreply@smartplacementportal.com>`,
        to,
        subject,
        text,
        html: html || text,
      });
      logger.info(`Email sent successfully to ${to}. Subject: "${subject}"`);
      return true;
    } catch (error: any) {
      logger.error(`Failed to send email to ${to} via SMTP: ${error?.message || error}`);
    }
  }

  // Fallback Simulation Logging
  logger.info(`[SIMULATED EMAIL SENT]
  To: ${to}
  Subject: ${subject}
  Message: ${text}
  -----------------------------`);
  return true;
}
