import { config } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * SMS Service (Twilio integration placeholder)
 */
class SMSService {
  /**
   * Send SMS
   */
  async sendSMS(to, message) {
    try {
      if (!config.twilio.accountSid || !config.twilio.authToken) {
        logger.warn('Twilio credentials not configured');
        return;
      }

      // Twilio integration would go here
      // const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
      // await client.messages.create({
      //   body: message,
      //   from: config.twilio.phoneNumber,
      //   to
      // });

      logger.info(`SMS would be sent to ${to}: ${message}`);
    } catch (error) {
      logger.error(`Failed to send SMS: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send OTP
   */
  async sendOTP(to, otp) {
    const message = `Your verification code is: ${otp}. Valid for 10 minutes.`;
    await this.sendSMS(to, message);
  }

  /**
   * Send notification
   */
  async sendNotification(to, notification) {
    await this.sendSMS(to, notification);
  }
}

export default new SMSService();

