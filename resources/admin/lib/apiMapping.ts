/**
 * API Mapping Configuration
 * 
 * Bu dosya, backend API'si ile frontend arasındaki mapping'leri içerir.
 * Backend formatı farklıysa bu dosyada mapping yapılabilir.
 */

/**
 * API prefix (base path)
 * Örnekler:
 * - '/api' (default)
 * - '/api/v1' (versioned)
 * - 'https://api.example.com' (absolute URL)
 */
export const apiPrefix = '/api'

/**
 * Order Status Mapping
 * Backend farklı status değerleri döndürüyorsa burada map edilebilir
 */
export const orderStatusMap: Record<string, string> = {
  // Backend -> Frontend mapping
  // Örnek: Backend 'PENDING' döndürüyorsa frontend 'pending' bekliyor
  // 'PENDING': 'pending',
  // 'CONFIRMED': 'confirmed',
  // vb.
}

/**
 * Order Status Reverse Mapping (Frontend -> Backend)
 */
export const orderStatusReverseMap: Record<string, string> = {
  // Frontend -> Backend mapping
  // Örnek: Frontend 'pending' gönderiyor, backend 'PENDING' bekliyor
  // 'pending': 'PENDING',
  // 'confirmed': 'CONFIRMED',
  // vb.
}

/**
 * Payment Status Mapping
 */
export const paymentStatusMap: Record<string, string> = {
  // Backend -> Frontend
}

/**
 * Payment Status Reverse Mapping
 */
export const paymentStatusReverseMap: Record<string, string> = {
  // Frontend -> Backend
}

/**
 * Fulfillment Type Mapping
 */
export const fulfillmentTypeMap: Record<string, string> = {
  // Backend -> Frontend
  // Örnek: Backend 'ship' döndürüyorsa frontend 'shipping' bekliyor
  // 'ship': 'shipping',
  // 'store_pickup': 'pickup',
}

/**
 * Fulfillment Type Reverse Mapping
 */
export const fulfillmentTypeReverseMap: Record<string, string> = {
  // Frontend -> Backend
  // Örnek: Frontend 'shipping' gönderiyor, backend 'ship' bekliyor
  // 'shipping': 'ship',
  // 'pickup': 'store_pickup',
}

/**
 * Helper: Order status'u backend'den frontend'e map et
 */
export function mapOrderStatus(backendStatus: string): string {
  return orderStatusMap[backendStatus] || backendStatus.toLowerCase()
}

/**
 * Helper: Order status'u frontend'den backend'e map et
 */
export function mapOrderStatusToBackend(frontendStatus: string): string {
  return orderStatusReverseMap[frontendStatus] || frontendStatus.toUpperCase()
}

/**
 * Helper: Payment status'u backend'den frontend'e map et
 */
export function mapPaymentStatus(backendStatus: string): string {
  return paymentStatusMap[backendStatus] || backendStatus.toLowerCase()
}

/**
 * Helper: Payment status'u frontend'den backend'e map et
 */
export function mapPaymentStatusToBackend(frontendStatus: string): string {
  return paymentStatusReverseMap[frontendStatus] || frontendStatus.toUpperCase()
}

/**
 * Helper: Fulfillment type'ı backend'den frontend'e map et
 */
export function mapFulfillmentType(backendType: string): string {
  return fulfillmentTypeMap[backendType] || backendType.toLowerCase()
}

/**
 * Helper: Fulfillment type'ı frontend'den backend'e map et
 */
export function mapFulfillmentTypeToBackend(frontendType: string): string {
  return fulfillmentTypeReverseMap[frontendType] || frontendType.toLowerCase()
}

/**
 * Para Birimi Notları:
 * - Frontend sayısal değer bekliyor (örn: 3500 = 3500 TL)
 * - Backend kuruş cinsinden döndürüyorsa (örn: 350000 = 3500 TL):
 *   src/lib/format.ts içindeki formatCurrency fonksiyonu güncellenebilir
 */

/**
 * Tarih Formatı Notları:
 * - Frontend ISO 8601 bekliyor (örn: '2024-01-20T10:00:00Z')
 * - Backend farklı format döndürüyorsa (örn: Unix timestamp, custom format):
 *   API response'larında tarih parse edilebilir
 *   Örnek: new Date(timestamp * 1000).toISOString()
 */
