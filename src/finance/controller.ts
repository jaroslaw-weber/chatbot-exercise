import { Context } from 'hono';
import { FinanceService } from './service.js';
import { WhatsAppService } from '../whatsapp/service.js';
import { WebhookBodySchema, MessageSchema, WebhookBody, Message } from './schemas.js';
import { validate } from '../utils/validation.js';

/**
 * Controller class that handles incoming webhook requests from WhatsApp.
 * Processes messages, validates them, delegates to the finance service,
 * and sends responses back via WhatsApp service.
 */
export class FinanceController {
  /**
   * The finance service responsible for processing messages and handling business logic.
   */
  private service: FinanceService;

  /**
   * The WhatsApp service responsible for sending messages back to users.
   */
  private whatsappService: WhatsAppService;

  /**
   * Creates a new FinanceController instance.
   * @param service - The finance service instance for processing messages
   * @param whatsappService - The WhatsApp service instance for sending responses
   */
  constructor(service: FinanceService, whatsappService: WhatsAppService) {
    this.service = service;
    this.whatsappService = whatsappService;
  }

  /**
   * Handles incoming webhook requests from WhatsApp.
   * Validates the request body, extracts the message, processes it,
   * and sends a response back to the user.
   * @param c - The Hono context object containing the request
   * @returns A promise that resolves to a response with status and result
   */
  async handleWebhook(c: Context): Promise<Response> {
    try {
      const rawBody = await c.req.json();
      console.log('Received webhook:', JSON.stringify(rawBody, null, 2));

      // Validate webhook body structure
      const bodyResult = validate(rawBody, WebhookBodySchema, 'webhook body');
      if (!bodyResult.success) {
        return c.json({ error: 'Invalid request body' }, 400);
      }

      // Extract message from the webhook body
      const message = this.extractMessage(bodyResult.data);
      if (!message) {
        return c.json({ status: 'ok' });
      }

      // Validate message format
      const messageResult = validate(message, MessageSchema, 'message');
      if (!messageResult.success) {
        return c.json({ error: 'Invalid message format' }, 400);
      }

      // Process the message through the finance service
      const response = await this.service.processMessage(messageResult.data);

      // Send response back to the user if one was generated
      if (response) {
        await this.whatsappService.sendMessage(messageResult.data.from, response);
      }

      return c.json({ status: 'processed', response });
    } catch (error) {
      console.error('Webhook error:', error);
      return c.json({ error: 'Internal error' }, 500);
    }
  }

  /**
   * Extracts the message from the webhook body.
   * @param body - The validated webhook body containing messages
   * @returns The extracted message or null if no message is found
   */
  private extractMessage(body: WebhookBody): Message | null {
    const message = body.messages?.[0];
    if (!message) {
      return null;
    }
    return {
      from: message.from,
      text: message.text?.body
    };
  }
}
