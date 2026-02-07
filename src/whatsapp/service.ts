export class WhatsAppService {
  /**
   * Sends a text message to a WhatsApp user via the 360dialog API.
   * Requires the D360_API_KEY environment variable to be set.
   * @param phoneNumber - The recipient's phone number in WhatsApp format
   * @param text - The message text to send
   * @returns A promise that resolves when the send operation completes
   */
  async sendMessage(phoneNumber: string, text: string): Promise<void> {
    const apiKey = process.env.D360_API_KEY;
    if (!apiKey) {
      console.error("D360_API_KEY not set");
      return;
    }

    // Send the message to the 360dialog WhatsApp API
    const response = await fetch(
      "https://waba-sandbox.360dialog.io/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "D360-API-KEY": apiKey,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phoneNumber,
          type: "text",
          text: {
            body: text,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send WhatsApp message:", error);
    }
  }
}
