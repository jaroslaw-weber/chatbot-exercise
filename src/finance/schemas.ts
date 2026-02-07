import { z } from 'zod';

export const WebhookBodySchema = z.object({
  messages: z.array(
    z.object({
      from: z.string().min(1),
      text: z.object({
        body: z.string().trim()
      }).optional()
    })
  ).min(1).optional()
});

export type WebhookBody = z.infer<typeof WebhookBodySchema>;

export const MessageSchema = z.object({
  from: z.string().min(1),
  text: z.string().trim().optional()
});

export type Message = z.infer<typeof MessageSchema>;

export const CommandSchema = z.enum(['summary', 'total', 'history', 'list', 'clear', 'help']);
export type Command = z.infer<typeof CommandSchema>;

export function parseCommand(text: string): Command | null {
  const normalized = text.toLowerCase().trim();
  if (CommandSchema.safeParse(normalized).success) {
    return normalized as Command;
  }
  return null;
}
