import { Context } from 'hono';
import { FinanceService } from './service.js';
import { WhatsAppService } from '../whatsapp/service.js';
import { WebhookBodySchema, MessageSchema, WebhookBody, Message } from './schemas.js';
import { BaseController } from '../controllers/BaseController.js';

export class FinanceController extends BaseController {
  private service: FinanceService;
  private whatsappService: WhatsAppService;

  constructor(service: FinanceService, whatsappService: WhatsAppService) {
    super();
    this.service = service;
    this.whatsappService = whatsappService;
  }

  async handleWebhook(c: Context): Promise<Response> {
    try {
      const rawBody = await this.parseRequestBody(c);
      console.log('Received webhook:', JSON.stringify(rawBody, null, 2));

      const bodyResult = this.validate(rawBody, WebhookBodySchema, 'webhook body');
      if (!bodyResult.success) {
        return this.errorResponse(c, 'Invalid request body', 400);
      }

      const message = this.extractMessage(bodyResult.data);
      if (!message) {
        return this.successResponse(c, { status: 'ok' });
      }

      const messageResult = this.validate(message, MessageSchema, 'message');
      if (!messageResult.success) {
        return this.errorResponse(c, 'Invalid message format', 400);
      }

      const response = await this.service.processMessage(messageResult.data);

      if (response) {
        await this.whatsappService.sendMessage(messageResult.data.from, response);
      }

      return this.successResponse(c, { status: 'processed', response });
    } catch (error) {
      return this.handleControllerError(c, error);
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
