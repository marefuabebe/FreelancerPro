import Stripe from 'stripe';
import { config } from '../config/env.js';
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';
import logger from '../utils/logger.js';
import { calculateFreelancerEarnings } from '../utils/calculateEarnings.js';

const stripe = new Stripe(config.stripe.secretKey);

/**
 * Payment Service
 */
class PaymentService {
  /**
   * Create Stripe customer
   */
  async createCustomer(user) {
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: {
          userId: user._id.toString(),
        },
      });

      await User.findByIdAndUpdate(user._id, {
        stripeCustomerId: customer.id,
      });

      return customer;
    } catch (error) {
      logger.error(`Stripe customer creation failed: ${error.message}`);
      throw new Error('Failed to create payment customer');
    }
  }

  /**
   * Create Stripe connected account for freelancer
   */
  async createConnectedAccount(user) {
    try {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          userId: user._id.toString(),
        },
      });

      await User.findByIdAndUpdate(user._id, {
        stripeAccountId: account.id,
      });

      return account;
    } catch (error) {
      logger.error(`Stripe account creation failed: ${error.message}`);
      throw new Error('Failed to create payment account');
    }
  }

  /**
   * Add payment method
   */
  async addPaymentMethod(userId, paymentMethodId, cardDetails = null) {
    try {
      let user = await User.findById(userId);

      console.log('Adding payment method for user:', userId);
      console.log('Card details:', cardDetails);

      // If cardDetails are provided, save as mock method (for dev/demo)
      if (cardDetails && cardDetails.cardNumber) {
        const mockPaymentMethod = {
          id: `mock_${Date.now()}`,
          type: 'card',
          cardNumber: cardDetails.cardNumber.toString(), // Store full card number for demo
          last4: cardDetails.cardNumber.toString().slice(-4),
          brand: cardDetails.brand || 'visa',
          expiryMonth: cardDetails.expiryMonth || cardDetails.expMonth,
          expiryYear: cardDetails.expiryYear || cardDetails.expYear,
          cvv: cardDetails.cvv || cardDetails.cvc, // Store CVV for demo
          isDefault: !user.paymentMethods || user.paymentMethods.length === 0,
          billingAddress: cardDetails.billingAddress || {}
        };

        console.log('Creating mock payment method:', mockPaymentMethod);

        const db = User.db;
        await db.collection('users').updateOne(
          { _id: user._id },
          { $push: { paymentMethods: mockPaymentMethod } }
        );

        console.log('✅ Mock payment method added successfully');
        return mockPaymentMethod;
      }

      if (!user.stripeCustomerId) {
        await this.createCustomer(user);
        user = await User.findById(userId);
      }

      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
      });

      // Use raw MongoDB to bypass Mongoose schema caching
      const paymentMethodData = {
        id: paymentMethod.id,
        type: paymentMethod.type,
        last4: paymentMethod.card?.last4,
        brand: paymentMethod.card?.brand,
        expiryMonth: paymentMethod.card?.exp_month,
        expiryYear: paymentMethod.card?.exp_year,
        isDefault: !user.paymentMethods || user.paymentMethods.length === 0,
      };

      // Use native MongoDB driver instead of Mongoose
      const db = User.db;
      await db.collection('users').updateOne(
        { _id: user._id },
        { $push: { paymentMethods: paymentMethodData } }
      );

      return paymentMethod;
    } catch (error) {
      console.error('❌ Payment method addition failed:', error);
      logger.error(`Payment method addition failed: ${error.message}`);
      throw new Error(`Failed to add payment method: ${error.message}`);
    }
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(amount, currency, customerId, metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: customerId,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      logger.error(`Payment intent creation failed: ${error.message}`);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Process payment
   */
  async processPayment({ userId, amount, contractId, milestoneId, description }) {
    try {
      const user = await User.findById(userId);

      if (!user.stripeCustomerId) {
        throw new Error('No payment method found');
      }

      const earnings = calculateFreelancerEarnings(amount);

      const paymentIntent = await this.createPaymentIntent(amount, 'USD', user.stripeCustomerId, {
        userId: userId.toString(),
        contractId: contractId?.toString(),
        milestoneId: milestoneId?.toString(),
      });

      // Create transaction record
      const transaction = await Transaction.create({
        user: userId,
        type: 'payment',
        amount,
        status: 'pending',
        description,
        relatedTo: {
          model: 'Contract',
          id: contractId,
        },
        paymentMethod: 'stripe',
        stripePaymentIntentId: paymentIntent.id,
        platformFee: earnings.platformFee,
        processingFee: earnings.processingFee,
        netAmount: earnings.netEarnings,
      });

      return { paymentIntent, transaction };
    } catch (error) {
      logger.error(`Payment processing failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Confirm payment
   */
  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

      // Update transaction
      await Transaction.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentId },
        {
          status: paymentIntent.status === 'succeeded' ? 'completed' : 'processing',
          completedAt: paymentIntent.status === 'succeeded' ? new Date() : null,
        }
      );

      return paymentIntent;
    } catch (error) {
      logger.error(`Payment confirmation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create payout to freelancer
   */
  async createPayout(userId, amount, currency = 'USD') {
    try {
      const user = await User.findById(userId);

      if (!user.stripeAccountId) {
        throw new Error('No payout account configured');
      }

      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        destination: user.stripeAccountId,
        metadata: {
          userId: userId.toString(),
        },
      });

      // Create transaction record
      const transaction = await Transaction.create({
        user: userId,
        type: 'payout',
        amount,
        status: 'completed',
        description: 'Payout to bank account',
        paymentMethod: 'stripe',
        stripeTransferId: transfer.id,
        completedAt: new Date(),
      });

      return { transfer, transaction };
    } catch (error) {
      logger.error(`Payout failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create refund
   */
  async createRefund(paymentIntentId, amount) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      // Update transaction
      await Transaction.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentId },
        {
          status: 'refunded',
          refundedAmount: refund.amount / 100,
          refundedAt: new Date(),
        }
      );

      return refund;
    } catch (error) {
      logger.error(`Refund failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance() {
    try {
      const balance = await stripe.balance.retrieve();
      return balance;
    } catch (error) {
      logger.error(`Balance retrieval failed: ${error.message}`);
      throw error;
    }
  }
}

export default new PaymentService();

