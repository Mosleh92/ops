import nodemailer from 'nodemailer';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: config.services.sendgrid.apiKey,
    },
  });

  static async sendMail(options: { to: string; subject: string; text: string; html?: string }): Promise<void> {
    try {
      await EmailService.transporter.sendMail({
        from: `${config.services.sendgrid.fromName} <${config.services.sendgrid.fromEmail}>`,
        ...options,
      });
      logger.info(`Email sent to ${options.to}`);
    } catch (err) {
      logger.error('Email send failed', err);
      throw err;
    }
  }
}

export default EmailService;
