import { z } from 'zod';

const envSchema = z.object({
  apiUrl: z.url().optional(),
  apiMocking: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

const parsed = envSchema.safeParse({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || undefined,
  apiMocking: process.env.NEXT_PUBLIC_API_MOCKING || undefined,
});

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;

export class ConfigurationError extends Error {
  override readonly name = 'ConfigurationError';
}

export function getApiBaseUrl(): string {
  if (!env.apiUrl) {
    throw new ConfigurationError(
      'NEXT_PUBLIC_API_URL is not set. Copy .env.example to .env.local and configure it.',
    );
  }
  return env.apiUrl;
}
