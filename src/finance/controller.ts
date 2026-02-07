import { Context } from 'hono';
import { FinanceService } from './service.js';
import { WhatsAppService } from '../whatsapp/service.js';
import { WebhookBodySchema, MessageSchema, WebhookBody, Message } from './schemas.js';
import { validate } from '../utils/validation.js';

/** Handles webhook requests and routes messages to appropriate handlers */
export class FinanceController {
  private service: FinanceService;
  private whatsappService: WhatsAppService;

  constructor(service: FinanceService, whatsappService: WhatsAppService) {
    this.service = service;
    this.whatsappService = whatsappService;
  }

  async handleWebhook(c: Context): Promise<Response> {
    try {
      const rawBody = await c.req.json();
      console.log('Received webhook:', JSON.stringify(rawBody, null, 2));

      const bodyResult = validate(rawBody, WebhookBodySchema, 'webhook body');
      if (!bodyResult.success) {
        return c.json({ error: 'Invalid request body' }, 400);
      }

      const message = this.extractMessage(bodyResult.data);
      if (!message) {
        return c.json({ status: 'ok' });
      }

      const messageResult = validate(message, MessageSchema, 'message');
      if (!messageResult.success) {
        return c.json({ error: 'Invalid message format' }, 400);
      }

      const response = await this.service.processMessage(messageResult.data);

      if (response) {
        await this.whatsappService.sendMessage(messageResult.data.from, response);
      }

      return c.json({ status: 'processed', response });
    } catch (error) {
      console.error('Webhook error:', error);
      return c.json({ error: 'Internal error' }, 500);
    }
  }

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
