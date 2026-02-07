import { Context } from 'hono';
import { z } from 'zod';

export abstract class BaseController {
  protected async parseRequestBody(c: Context): Promise<unknown> {
    return await c.req.json();
  }

  protected validate<TSchema extends z.ZodTypeAny>(
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

  protected successResponse<T>(c: Context, data: T, status: number = 200): Response {
    return c.json(data, status);
  }

  protected errorResponse(c: Context, message: string, status: number = 500): Response {
    return c.json({ error: message }, status);
  }

  protected handleControllerError(c: Context, error: unknown): Response {
    console.error('Controller error:', error);
    return this.errorResponse(c, 'Internal error', 500);
  }
}
