import Stripe from 'stripe';
import { logger } from '../../utils/logger';

const STRIPE_API_KEY = process.env['STRIPE_API_KEY'] || '';
const STRIPE_WEBHOOK_SECRET = process.env['STRIPE_WEBHOOK_SECRET'] || '';

export class StripeService {
  private stripe: Stripe;
  private logger: typeof logger;

  constructor() {
    this.stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2023-08-16' });
    this.logger = logger;
  }

  // Create a payment intent for one-time payments
  async createPaymentIntent({ amount, currency, customerId, metadata }: { amount: number; currency: string; customerId?: string; metadata?: any; }) {
    try {
      const params: Stripe.PaymentIntentCreateParams = {
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
        metadata,
      };
      if (customerId) params.customer = customerId;
      const paymentIntent = await this.stripe.paymentIntents.create(params);
      this.logger.info('Stripe payment intent created', { paymentIntent });
      // AuditLog.log(...)
      return paymentIntent;
    } catch (error) {
      this.logger.error('Stripe payment intent error', { error });
      throw error;
    }
  }

  // Create a subscription for recurring payments
  async createSubscription({ customerId, priceId, metadata }: { customerId: string; priceId: string; metadata?: any; }) {
    try {
      const params: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      };
      if (metadata) params.metadata = metadata;
      const subscription = await this.stripe.subscriptions.create(params);
      this.logger.info('Stripe subscription created', { subscription });
      return subscription;
    } catch (error) {
      this.logger.error('Stripe subscription error', { error });
      throw error;
    }
  }

  // Capture a payment (confirm payment intent)
  async capturePayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId);
      this.logger.info('Stripe payment captured', { paymentIntent });
      return paymentIntent;
    } catch (error) {
      this.logger.error('Stripe capture payment error', { error });
      throw error;
    }
  }

  // Refund a payment
  async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      const params: Stripe.RefundCreateParams = { payment_intent: paymentIntentId };
      if (amount != null) params.amount = amount;
      const refund = await this.stripe.refunds.create(params);
      this.logger.info('Stripe refund created', { refund });
      return refund;
    } catch (error) {
      this.logger.error('Stripe refund error', { error });
      throw error;
    }
  }

  // Get customer payment history
  async getPaymentHistory(customerId: string) {
    try {
      const payments = await this.stripe.paymentIntents.list({ customer: customerId, limit: 100 });
      this.logger.info('Stripe payment history fetched', { customerId });
      return payments.data;
    } catch (error) {
      this.logger.error('Stripe payment history error', { error });
      throw error;
    }
  }

  // Get customer details
  async getCustomer(customerId: string) {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      this.logger.info('Stripe customer fetched', { customerId });
      return customer;
    } catch (error) {
      this.logger.error('Stripe get customer error', { error });
      throw error;
    }
  }

  // Create or update a customer
  async upsertCustomer({ email, name, metadata }: { email: string; name?: string; metadata?: any; }) {
    try {
      // Try to find existing customer by email (Stripe does not support direct search, so this is a placeholder)
      // In production, store Stripe customerId in your DB for lookup
      const params: Stripe.CustomerCreateParams = { email, metadata };
      if (name) params.name = name;
      const customer = await this.stripe.customers.create(params);
      this.logger.info('Stripe customer upserted', { customer });
      return customer;
    } catch (error) {
      this.logger.error('Stripe upsert customer error', { error });
      throw error;
    }
  }

  // Handle Stripe webhooks securely
  verifyAndHandleWebhook(signature: string, payload: Buffer, handler: (event: Stripe.Event) => Promise<void>) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
      this.logger.info('Stripe webhook verified', { eventType: event.type });
    } catch (err) {
      this.logger.error('Stripe webhook signature verification failed', { err });
      throw new Error('Invalid Stripe webhook signature');
    }
    return handler(event);
  }

  // Add more methods for payment method management, retry logic, etc.
} 