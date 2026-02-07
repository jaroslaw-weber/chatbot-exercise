import { z } from 'zod';

/**
 * Zod schema for validating the structure of incoming webhook bodies from WhatsApp.
 * Ensures the body contains a properly formatted messages array.
 */
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

/**
 * Type inferred from WebhookBodySchema representing a valid webhook body.
 */
export type WebhookBody = z.infer<typeof WebhookBodySchema>;

/**
 * Zod schema for validating message objects containing sender and text information.
 */
export const MessageSchema = z.object({
  from: z.string().min(1),
  text: z.string().trim().optional()
});

/**
 * Type inferred from MessageSchema representing a valid message.
 */
export type Message = z.infer<typeof MessageSchema>;

/**
 * Zod schema defining the supported command types.
 */
export const CommandSchema = z.enum(['summary', 'total', 'history', 'list', 'clear', 'help']);

/**
 * Type inferred from CommandSchema representing a valid command.
 */
export type Command = z.infer<typeof CommandSchema>;

/**
 * Parses a text string to determine if it's a valid command.
 * @param text - The text to parse
 * @returns The command if valid, null otherwise
 */
export function parseCommand(text: string): Command | null {
  const normalized = text.toLowerCase().trim();
  if (CommandSchema.safeParse(normalized).success) {
    return normalized as Command;
  }
  return null;
}
