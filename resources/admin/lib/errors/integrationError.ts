/**
 * Integration Error Helpers
 * Standardized helpers for detecting and handling API integration errors
 */

import { IntegrationError } from '../errors'
import { apiBaseUrl } from '../integration'

export const INTEGRATION_ERROR_CODE = 'API_RETURNED_HTML'

export function isIntegrationError(err: unknown): err is IntegrationError {
  return err instanceof IntegrationError
}

export function toIntegrationDetails(err: unknown): {
  message: string
  endpoint?: string
  baseURL?: string
} {
  if (!isIntegrationError(err)) {
    return {
      message: err instanceof Error ? err.message : 'Bilinmeyen hata',
    }
  }

  const details = err.details || {}
  const url = details.url as string | undefined

  return {
    message: err.message,
    endpoint: url || undefined,
    baseURL: apiBaseUrl,
  }
}
