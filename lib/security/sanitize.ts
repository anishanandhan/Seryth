/**
 * Input sanitization utilities for AURA by SERYTH
 * Protects against XSS, injection attacks, and malformed inputs
 */

/**
 * Strips control characters (U+0000-U+001F), zero-width characters (U+200B, U+FEFF),
 * and bidirectional override characters. Applies Unicode NFC normalization.
 *
 * @param raw - The raw input string to sanitize
 * @returns A sanitized string safe for storage and display
 */
export function sanitizeInput(raw: string): string {
  if (typeof raw !== 'string') {
    return ''
  }

  // Remove control characters (U+0000-U+001F except newline/tab)
  let cleaned = raw.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '')

  // Remove zero-width characters
  cleaned = cleaned.replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, '')

  // Remove bidirectional override characters
  cleaned = cleaned.replace(/[\u202A-\u202E]/g, '')

  // Apply Unicode NFC normalization
  cleaned = cleaned.normalize('NFC')

  return cleaned
}

/**
 * Escapes HTML special characters (&, <, >, ", ') to prevent XSS attacks.
 *
 * @param input - The input string potentially containing HTML
 * @returns HTML-escaped string safe for rendering
 */
export function escapeHtml(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char)
}

/**
 * Redacts secret-shaped strings from log output to prevent credential leakage.
 * Matches: API keys (sk-...), Bearer tokens, email addresses, common secret patterns.
 *
 * @param input - The string potentially containing secrets
 * @returns String with secrets redacted as [REDACTED]
 */
export function redactSecrets(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  let redacted = input

  // Redact API keys (sk-*, pk-*, key-*, api-*)
  redacted = redacted.replace(/\b(sk|pk|key|api)[-_][a-zA-Z0-9]{16,}\b/gi, '[REDACTED]')

  // Redact Bearer tokens
  redacted = redacted.replace(/Bearer\s+[a-zA-Z0-9\-._~+/]+=*/gi, 'Bearer [REDACTED]')

  // Redact email addresses
  redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')

  // Redact JWT tokens (three base64 segments separated by dots)
  redacted = redacted.replace(/\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/g, '[REDACTED_JWT]')

  // Redact generic secrets (secret=..., password=..., token=...)
  redacted = redacted.replace(/(secret|password|token|pwd|pass)(\s*[=:]\s*)([^\s,}"']+)/gi, '$1$2[REDACTED]')

  return redacted
}

/**
 * Validates that a string contains only safe alphanumeric characters and common punctuation.
 * Useful for validating usernames, identifiers, etc.
 *
 * @param input - The string to validate
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns True if input is safe, false otherwise
 */
export function isSafeString(input: string, maxLength = 100): boolean {
  if (typeof input !== 'string' || input.length === 0 || input.length > maxLength) {
    return false
  }

  // Allow alphanumeric, spaces, and common punctuation only
  const safePattern = /^[a-zA-Z0-9\s\-_.,!?@()]+$/
  return safePattern.test(input)
}

/**
 * Strips all HTML tags from input, leaving only text content.
 *
 * @param input - The string potentially containing HTML
 * @returns String with all HTML tags removed
 */
export function stripHtml(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input.replace(/<[^>]*>/g, '')
}

/**
 * Validates and sanitizes a URL to ensure it's safe to use.
 * Only allows http/https protocols.
 *
 * @param url - The URL string to validate
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== 'string' || url.trim().length === 0) {
    return null
  }

  try {
    const parsed = new URL(url.trim())

    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Sanitizes user-provided fragrance names or descriptions.
 * Ensures no malicious scripts or excessive length.
 *
 * @param input - The user input to sanitize
 * @param maxLength - Maximum allowed length (default: 200)
 * @returns Sanitized string
 */
export function sanitizeUserInput(input: string, maxLength = 200): string {
  if (typeof input !== 'string') {
    return ''
  }

  // Apply basic sanitization
  let cleaned = sanitizeInput(input)

  // Strip HTML tags
  cleaned = stripHtml(cleaned)

  // Escape remaining special characters
  cleaned = escapeHtml(cleaned)

  // Limit length
  cleaned = cleaned.slice(0, maxLength)

  // Trim whitespace
  cleaned = cleaned.trim()

  return cleaned
}
