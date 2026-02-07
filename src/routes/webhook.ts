import { Hono } from 'hono';
import { FinanceService } from '../finance/service.js';
import { FinanceController } from '../finance/controller.js';

const webhook = new Hono();

const financeService = new FinanceService();
const financeController = new FinanceController(financeService);

webhook.post('/', (c) => financeController.handleWebhook(c));

export default webhook;
