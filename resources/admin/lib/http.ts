import axios from 'axios'
import { toastService } from '@admin/composables/useToast'
import { apiBaseUrl, withCredentials } from './integration'
import { IntegrationError, isHtmlResponse } from './errors'
import { INTEGRATION_ERROR_CODE } from './errors/integrationError'

const isDev = import.meta.env.DEV

export const http = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials,
})

// Request interceptor
http.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // For FormData, let browser set Content-Type with boundary automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    // DEV-only debug logging
    if (isDev) {
      const url = `${config.baseURL}${config.url}`
      const logData: Record<string, unknown> = {
        method: config.method?.toUpperCase(),
        url,
      }
      if (config.params) {
        logData.params = config.params
      }
      if (config.data) {
        logData.body = config.data instanceof FormData ? '[FormData]' : config.data
      }
      console.debug('[HTTP Request]', logData)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
http.interceptors.response.use(
  (response) => {
    // Check if response is HTML instead of JSON
    const contentType = response.headers['content-type'] || ''
    const isHtmlContentType = contentType.includes('text/html')
    const responseData = response.data

    if (isHtmlContentType || (typeof responseData === 'string' && isHtmlResponse(responseData))) {
      const url = `${response.config.baseURL}${response.config.url}`
      const error = new IntegrationError(
        INTEGRATION_ERROR_CODE,
        'API endpoint JSON dönmüyor. Laravel API çalışıyor mu? VITE_API_BASE_URL doğru mu?',
        {
          url,
          contentType,
          apiBaseUrl,
        }
      )
      return Promise.reject(error)
    }

    // DEV-only debug logging
    if (isDev) {
      const url = `${response.config.baseURL}${response.config.url}`
      console.debug('[HTTP Response]', {
        status: response.status,
        url,
      })
    }
    return response
  },
  (error) => {
    // IntegrationError (HTML response) - don't show toast, let component handle it
    if (error instanceof IntegrationError) {
      return Promise.reject(error)
    }

    // Network error (no response) - ECONNREFUSED, timeout, etc.
    if (!error.response) {
      // DEV-only debug logging
      if (isDev) {
        const url = error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown'
        console.debug('[HTTP Error]', {
          status: 0,
          url,
          message: 'Network error - no response',
          error: error.message,
        })
      }
      // Toast dedupe will prevent spam - same error won't show multiple times within 10 seconds
      toastService.showError('Bağlantı Hatası', 'Sunucuya bağlanılamadı. Backend çalışıyor mu?')
      return Promise.reject(error)
    }

    const status = error.response.status
    const errorMessage = error.response.data?.message || error.response.data?.error || 'Bir hata oluştu'

    // DEV-only debug logging
    if (isDev) {
      const url = `${error.config.baseURL}${error.config.url}`
      console.debug('[HTTP Error]', {
        status,
        url,
        message: errorMessage,
      })
    }

    // 401 - Unauthorized
    if (status === 401) {
      localStorage.removeItem('token')
      toastService.showError('Yetkisiz Erişim', 'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.')
      return Promise.reject(error)
    }

    // 403 - Forbidden
    if (status === 403) {
      toastService.showError('Erişim Reddedildi', 'Bu işlem için yetkiniz bulunmamaktadır.')
      return Promise.reject(error)
    }

    // 404 - Not Found (don't show toast, let component show empty-state)
    if (status === 404) {
      // Component will handle empty-state display
      return Promise.reject(error)
    }

    // 422 - Unprocessable Entity (Validation errors)
    if (status === 422) {
      const validationErrors = error.response.data?.errors
      const message = validationErrors
        ? Object.values(validationErrors).flat().join(', ')
        : errorMessage
      toastService.showError('Doğrulama Hatası', message)
      return Promise.reject(error)
    }

    // 400 - Bad Request
    if (status === 400) {
      toastService.showError('Geçersiz İstek', errorMessage)
      return Promise.reject(error)
    }

    // 500+ - Internal Server Error
    if (status >= 500) {
      toastService.showError('Sunucu Hatası', 'Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      return Promise.reject(error)
    }

    // Other 4xx errors (405, 409, etc.)
    if (status >= 400) {
      toastService.showError('İstek Hatası', errorMessage)
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default http
