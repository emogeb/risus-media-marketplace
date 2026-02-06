/**
 * Integration Configuration
 * 
 * Merkezi integration ayarları - environment değişkenlerini tek yerden yönetir
 */

// Güvenli fallback: 'true' string veya boolean true kontrolü
// Default: false (Laravel API'den çek)
const getUseMocksValue = (): boolean => {
  const value = import.meta.env.VITE_USE_MOCKS
  if (value === 'true') {
    return true
  }
  return false
}

export const useMocks = import.meta.env.DEV && getUseMocksValue()

// Ensure we don't use root path which hits storefront
const envApiUrl = import.meta.env.VITE_API_BASE_URL
export const apiBaseUrl = (envApiUrl && envApiUrl !== '/') ? envApiUrl : '/api'

export const wsUrl = import.meta.env.VITE_WS_URL || ''

export const withCredentials = import.meta.env.VITE_WITH_CREDENTIALS === 'true'

// DEV-only debug export
export const envDebug = {
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  VITE_USE_MOCKS: import.meta.env.VITE_USE_MOCKS,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
}
