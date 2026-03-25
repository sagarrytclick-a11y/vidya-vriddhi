import { NextRequest } from 'next/server'

// Get credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export function verifyCredentials(username: string, password: string): boolean {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('Admin credentials not configured in environment variables')
    return false
  }
  
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export function createAuthToken(): string {
  // Create a simple token for session management
  return Buffer.from(`${Date.now()}:${ADMIN_USERNAME}`).toString('base64')
}

export function verifyAuthToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [timestamp] = decoded.split(':')
    
    // Check if token is not older than 24 hours
    const tokenAge = Date.now() - parseInt(timestamp)
    return tokenAge < 24 * 60 * 60 * 1000 // 24 hours
  } catch {
    return false
  }
}
