import { z } from 'zod';

/**
 * Validates data against a Zod schema and returns a typed result.
 * Provides type-safe validation with error logging.
 * @template TSchema - The Zod schema type to validate against
 * @param data - The unknown data to validate
 * @param schema - The Zod schema to use for validation
 * @param context - Optional context string for error messages (default: 'request')
 * @returns An object with success flag and either validated data or a ZodError
 */
export function validate<TSchema extends z.ZodTypeAny>(
  data: unknown,
  schema: TSchema,
  context: string = 'request'
): { success: true; data: z.infer<TSchema> } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error(`Invalid ${context}:`, result.error);
  }

  return result.success ? { success: true, data: result.data } : { success: false, error: result.error };
}
