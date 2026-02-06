/**
 * Custom error types for API integration
 */

export class IntegrationError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'IntegrationError'
  }
}

export function isHtmlResponse(data: unknown): boolean {
  if (typeof data !== 'string') return false
  const lower = data.toLowerCase().trim()
  return lower.includes('<!doctype html') || lower.includes('<html')
}
