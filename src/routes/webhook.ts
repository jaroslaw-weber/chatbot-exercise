import { Hono } from 'hono';
import { FinanceService } from '../features/finance/service.js';
import { FinanceController } from '../features/finance/controller.js';

const webhook = new Hono();

const financeService = new FinanceService();
const financeController = new FinanceController(financeService);

webhook.post('/', (c) => financeController.handleWebhook(c));

export default webhook;
