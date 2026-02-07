export class WhatsAppService {
  async sendMessage(phoneNumber: string, text: string): Promise<void> {
    const apiKey = process.env.D360_API_KEY;
    if (!apiKey) {
      console.error('D360_API_KEY not set');
      return;
    }
    
    const response = await fetch('https://waba-sandbox.360dialog.io/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'D360-API-KEY': apiKey
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'text',
        text: {
          body: text
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send WhatsApp message:', error);
    }
  }
}
