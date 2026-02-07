import { Hono } from 'hono';
import { FinanceService } from '../finance/service.js';
import { WhatsAppService } from '../whatsapp/service.js';
import { FinanceController } from '../finance/controller.js';

/** Webhook router for WhatsApp messages */
const webhook = new Hono();

const financeService = new FinanceService();
const whatsappService = new WhatsAppService();
const financeController = new FinanceController(financeService, whatsappService);

webhook.post('/', (c) => financeController.handleWebhook(c));

export default webhook;
