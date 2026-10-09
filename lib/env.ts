import { z } from 'zod'

/**
 * Environment variable validation schema
 * Add all required environment variables here
 */
const envSchema = z.object({
  // Database (Required)
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // ImageKit (Required for image uploads)
  IMAGEKIT_PUBLIC_KEY: z.string().min(1, 'IMAGEKIT_PUBLIC_KEY is required'),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1, 'IMAGEKIT_PRIVATE_KEY is required'),
  IMAGEKIT_URL_ENDPOINT: z.string().url().min(1, 'IMAGEKIT_URL_ENDPOINT is required'),

  // Admin Auth (Required)
  ADMIN_USERNAME: z.string().min(1, 'ADMIN_USERNAME is required'),
  ADMIN_PASSWORD: z.string().min(1, 'ADMIN_PASSWORD is required'),
  ADMIN_SESSION_SECRET: z
    .string()
    .min(32, 'ADMIN_SESSION_SECRET must be at least 32 characters'),

  // Clerk Authentication (Required)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required'),
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1, 'NEXT_PUBLIC_CLERK_SIGN_IN_URL is required'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1, 'NEXT_PUBLIC_CLERK_SIGN_UP_URL is required'),

  // SMTP Email (Optional until mail credentials are configured)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().regex(/^\d+$/).or(z.literal('')).optional(),
  SMTP_SECURE: z.enum(['true', 'false']).or(z.literal('')).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM_EMAIL: z.string().email().or(z.literal('')).optional(),
  SMTP_CC_EMAILS: z.string().optional(),
  ADMIN_EMAIL: z.string().min(1, 'ADMIN_EMAIL is required').refine(
    (value) =>
      value
        .split(',')
        .every((email) => z.string().email().safeParse(email.trim()).success),
    'ADMIN_EMAIL must contain valid comma-separated email addresses'
  ),

  // Optional
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  ADMIN_USERS: z.string().optional(),
})

/**
 * Validated environment variables
 */
export const env = envSchema.parse(process.env)

/**
 * Validate environment variables at runtime
 * Call this early in the application lifecycle (e.g., in layout.tsx)
 */
export function validateEnv(): void {
  try {
    envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((e: z.ZodIssue) => e.path.join('.')).join(', ')
      console.error('❌ Missing or invalid environment variables:', missingVars)
      throw new Error(`Environment validation failed: ${missingVars}`)
    }
    throw error
  }
}

export default env
