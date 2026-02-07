import { Context } from 'hono';
import { FinanceService } from './service.js';
import { WebhookBodySchema, MessageSchema } from './schemas.js';

export class FinanceController {
  private service: FinanceService;
  
  constructor(service: FinanceService) {
    this.service = service;
  }
  
  async handleWebhook(c: Context): Promise<Response> {
    try {
      const rawBody = await c.req.json();
      console.log('Received webhook:', JSON.stringify(rawBody, null, 2));
      
      const validationResult = WebhookBodySchema.safeParse(rawBody);
      
      if (!validationResult.success) {
        console.error('Invalid webhook body:', validationResult.error);
        return c.json({ error: 'Invalid request body' }, 400);
      }
      
      const body = validationResult.data;
      
      const message = body.messages?.[0];
      if (!message) {
        return c.json({ status: 'ok' });
      }
      
      const messageResult = MessageSchema.safeParse({
        from: message.from,
        text: message.text?.body
      });
      
      if (!messageResult.success) {
        console.error('Invalid message:', messageResult.error);
        return c.json({ error: 'Invalid message format' }, 400);
      }
      
      const response = await this.service.processMessage(messageResult.data);
      
      if (response) {
        await this.service.sendWhatsAppMessage(messageResult.data.from, response);
      }
      
      return c.json({ status: 'processed', response });
    } catch (error) {
      console.error('Webhook error:', error);
      return c.json({ error: 'Internal error' }, 500);
    }
  }
}
