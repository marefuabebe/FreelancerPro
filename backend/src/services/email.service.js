import { sendEmail, sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail, sendInvoiceEmail } from '../utils/sendEmail.js';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Email Service
 */
class EmailService {
  /**
   * Send welcome email to new user
   */
  async sendWelcome(user) {
    try {
      await sendWelcomeEmail(user.email, user.firstName);
    } catch (error) {
      logger.error(`Failed to send welcome email: ${error.message}`);
    }
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(user, token) {
    try {
      await sendVerificationEmail(user.email, user.firstName, token);
    } catch (error) {
      logger.error(`Failed to send verification email: ${error.message}`);
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(user, token) {
    try {
      await sendPasswordResetEmail(user.email, user.firstName, token);
    } catch (error) {
      logger.error(`Failed to send password reset email: ${error.message}`);
    }
  }

  /**
   * Send proposal received notification
   */
  async sendProposalReceived(client, job, freelancer) {
    try {
      await sendEmail({
        to: client.email,
        subject: 'New Proposal Received',
        html: `
          <h2>New Proposal Received</h2>
          <p>Hi ${client.firstName},</p>
          <p>You have received a new proposal from <strong>${freelancer.fullName}</strong> for your job:</p>
          <h3>${job.title}</h3>
          <p><a href="${config.frontendUrl}/proposals">View Proposal</a></p>
        `,
      });
    } catch (error) {
      logger.error(`Failed to send proposal notification: ${error.message}`);
    }
  }

  /**
   * Send proposal accepted notification
   */
  async sendProposalAccepted(freelancer, job) {
    try {
      await sendEmail({
        to: freelancer.email,
        subject: 'Your Proposal Has Been Accepted!',
        html: `
          <h2>Congratulations!</h2>
          <p>Hi ${freelancer.firstName},</p>
          <p>Your proposal for the job "<strong>${job.title}</strong>" has been accepted!</p>
          <p><a href="${config.frontendUrl}/contracts">View Contract</a></p>
        `,
      });
    } catch (error) {
      logger.error(`Failed to send proposal accepted email: ${error.message}`);
    }
  }

  /**
   * Send contract created notification
   */
  async sendContractCreated(client, freelancer, contract) {
    try {
      const emails = [
        {
          to: client.email,
          name: client.firstName,
        },
        {
          to: freelancer.email,
          name: freelancer.firstName,
        },
      ];

      for (const recipient of emails) {
        await sendEmail({
          to: recipient.to,
          subject: 'New Contract Created',
          html: `
            <h2>Contract Created</h2>
            <p>Hi ${recipient.name},</p>
            <p>A new contract has been created: <strong>${contract.title}</strong></p>
            <p>Contract Amount: $${contract.amount}</p>
            <p><a href="${config.frontendUrl}/contracts/${contract._id}">View Contract</a></p>
          `,
        });
      }
    } catch (error) {
      logger.error(`Failed to send contract created email: ${error.message}`);
    }
  }

  /**
   * Send milestone submitted notification
   */
  async sendMilestoneSubmitted(client, milestone, contract) {
    try {
      await sendEmail({
        to: client.email,
        subject: 'Milestone Submitted for Review',
        html: `
          <h2>Milestone Submitted</h2>
          <p>Hi ${client.firstName},</p>
          <p>A milestone has been submitted for review:</p>
          <h3>${milestone.title}</h3>
          <p>Contract: ${contract.title}</p>
          <p><a href="${config.frontendUrl}/contracts/${contract._id}">Review Milestone</a></p>
        `,
      });
    } catch (error) {
      logger.error(`Failed to send milestone submitted email: ${error.message}`);
    }
  }

  /**
   * Send payment received notification
   */
  async sendPaymentReceived(user, amount, description) {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Payment Received',
        html: `
          <h2>Payment Received</h2>
          <p>Hi ${user.firstName},</p>
          <p>You have received a payment of <strong>$${amount}</strong></p>
          <p>Description: ${description}</p>
          <p><a href="${config.frontendUrl}/transactions">View Transactions</a></p>
        `,
      });
    } catch (error) {
      logger.error(`Failed to send payment received email: ${error.message}`);
    }
  }

  /**
   * Send invoice
   */
  async sendInvoice(user, invoiceData) {
    try {
      await sendInvoiceEmail(user.email, invoiceData);
    } catch (error) {
      logger.error(`Failed to send invoice email: ${error.message}`);
    }
  }

  /**
   * Send job invitation
   */
  async sendJobInvitation(freelancer, job, client) {
    try {
      await sendEmail({
        to: freelancer.email,
        subject: 'You\'ve Been Invited to a Job',
        html: `
          <h2>Job Invitation</h2>
          <p>Hi ${freelancer.firstName},</p>
          <p>${client.firstName} has invited you to submit a proposal for:</p>
          <h3>${job.title}</h3>
          <p>Budget: $${job.budget.amount}</p>
          <p><a href="${config.frontendUrl}/jobs/${job.slug}">View Job</a></p>
        `,
      });
    } catch (error) {
      logger.error(`Failed to send job invitation email: ${error.message}`);
    }
  }
}

export default new EmailService();

