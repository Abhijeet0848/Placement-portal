import nodemailer from 'nodemailer';
import logger from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};
export const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<boolean> => {
  // If SMTP is not configured, fall back to mock logging (for local testing without creds)
  if (!(process.env.SMTP_USER || process.env.EMAIL_USER) || !(process.env.SMTP_PASS || process.env.EMAIL_PASS)) {
    logger.info(`--- EMAIL NOTIFICATION (MOCK) ---`);
    logger.info(`To: ${to}`);
    logger.info(`Subject: ${subject}`);
    logger.info(`Message: ${text || 'HTML Content provided'}`);
    logger.info(`---------------------------------`);
    return true;
  }

  try {
    const info = await getTransporter().sendMail({
      from: process.env.SMTP_FROM || `"Smart Placement Portal" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    
    logger.info(`Email sent: ${info.messageId} to ${to}`);
    return true;
  } catch (error: any) {
    logger.error(`Error sending email to ${to}: ${error?.message || error}`);
    return false;
  }
};
