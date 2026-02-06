/**
 * Simple form validation helpers
 * For more complex validation, consider using zod or similar library
 */

export interface ValidationResult {
  valid: boolean
  message?: string
}

export function required(value: string | number | null | undefined): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: 'Bu alan zorunludur' }
  }
  return { valid: true }
}

export function minLength(value: string, min: number): ValidationResult {
  if (value.length < min) {
    return { valid: false, message: `En az ${min} karakter olmalıdır` }
  }
  return { valid: true }
}

export function email(value: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return { valid: false, message: 'Geçerli bir e-posta adresi giriniz' }
  }
  return { valid: true }
}

export function numberMin(value: number, min: number): ValidationResult {
  if (value < min) {
    return { valid: false, message: `Değer en az ${min} olmalıdır` }
  }
  return { valid: true }
}

export function validateField<T = unknown>(
  value: T,
  rules: Array<(value: T) => ValidationResult>
): ValidationResult {
  for (const rule of rules) {
    const result = rule(value)
    if (!result.valid) {
      return result
    }
  }
  return { valid: true }
}
