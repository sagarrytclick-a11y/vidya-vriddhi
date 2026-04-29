import { z } from 'zod'

/**
 * Environment variable validation schema
 * Add all required environment variables here
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // NextAuth / Authentication (if used)
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  
  // File Upload / Storage (if used)
  UPLOADTHING_SECRET: z.string().optional(),
  UPLOADTHING_APP_ID: z.string().optional(),
  
  // Email Service (if used)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
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
    console.log('✅ Environment variables validated successfully')
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
