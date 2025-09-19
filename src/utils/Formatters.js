/**
 * Utility functions for formatting and common operations
 * Follows DRY principle - centralized formatting logic
 */

/**
 * Format energy values with appropriate units
 * @param {number} kwh - Energy in kWh
 * @returns {string} Formatted energy string
 */
export function formatEnergy(kwh) {
  if (kwh < 0.000001) return `${(kwh * 1000000000).toFixed(2)} nWh`
  if (kwh < 0.001) return `${(kwh * 1000000).toFixed(2)} µWh`
  if (kwh < 1) return `${(kwh * 1000).toFixed(2)} mWh`
  return `${kwh.toFixed(2)} kWh`
}

/**
 * Format CO2 values with appropriate units
 * @param {number} grams - CO2 in grams
 * @returns {string} Formatted CO2 string
 */
export function formatCO2(grams) {
  if (grams < 0.001) return `${(grams * 1000000).toFixed(2)} µg`
  if (grams < 1) return `${(grams * 1000).toFixed(2)} mg`
  if (grams < 1000) return `${grams.toFixed(3)} g`
  return `${(grams / 1000).toFixed(2)} kg`
}

/**
 * Format numbers for display with appropriate precision
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
  if (value < 0.01) return value.toFixed(4)
  if (value < 1) return value.toFixed(2)
  if (value < 100) return value.toFixed(1)
  return Math.round(value).toLocaleString()
}

/**
 * Validate file path and check accessibility
 * @param {string} filePath - Path to validate
 * @returns {Promise<boolean>} True if valid and accessible
 */
export async function validateFilePath(filePath) {
  try {
    const fs = await import('fs/promises')
    await fs.access(filePath)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Generate a unique timestamp-based ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `gaya_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Deep merge objects (utility for configuration)
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export function deepMerge(target, source) {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  
  return result
}

/**
 * Sanitize string for safe HTML usage
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Calculate percentage with safe division
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Number of decimal places
 * @returns {number} Percentage
 */
export function calculatePercentage(value, total, decimals = 1) {
  if (total === 0) return 0
  return Number(((value / total) * 100).toFixed(decimals))
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Create a promise that resolves after specified time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after timeout
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
