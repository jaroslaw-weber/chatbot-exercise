import { z } from 'zod';

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
