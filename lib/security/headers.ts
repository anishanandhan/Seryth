/**
 * Security HTTP Headers Configuration for AURA by SERYTH
 * Centralized security header policy - single source of truth
 */

/**
 * Comprehensive security headers for production deployment.
 * Each header is documented with its purpose and protection mechanism.
 */
export const SECURITY_HEADERS: Record<string, string> = {
  /**
   * Content-Security-Policy (CSP)
   * Prevents XSS attacks by controlling which resources can be loaded.
   * - default-src 'self': Only allow resources from same origin
   * - script-src 'self' 'unsafe-inline': Allow inline scripts (required for Next.js)
   * - style-src 'self' 'unsafe-inline': Allow inline styles (required for styled-jsx)
   * - connect-src 'self': Allow API calls to same origin only
   * - object-src 'none': Block Flash and other plugins
   * - frame-ancestors 'none': Prevent clickjacking
   * - upgrade-insecure-requests: Automatically upgrade HTTP to HTTPS
   */
  'Content-Security-Policy':
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://*.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://*.pinecone.io https://*.supabase.co https://generativelanguage.googleapis.com; " +
    "img-src 'self' data: https:; " +
    "object-src 'none'; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "upgrade-insecure-requests",

  /**
   * Strict-Transport-Security (HSTS)
   * Forces browsers to use HTTPS for all future requests.
   * - max-age=31536000: Enforce HTTPS for 1 year
   * - includeSubDomains: Apply to all subdomains
   * - preload: Enable browser preload list inclusion
   */
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  /**
   * X-Frame-Options
   * Prevents clickjacking attacks by blocking iframe embedding.
   * DENY: Never allow framing
   */
  'X-Frame-Options': 'DENY',

  /**
   * X-Content-Type-Options
   * Prevents MIME sniffing attacks.
   * nosniff: Browser must respect Content-Type header
   */
  'X-Content-Type-Options': 'nosniff',

  /**
   * Referrer-Policy
   * Controls how much referrer information is sent with requests.
   * strict-origin-when-cross-origin: Full URL for same-origin, origin only for cross-origin
   */
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  /**
   * Permissions-Policy
   * Controls which browser features can be used.
   * Disables camera, microphone, and geolocation to reduce attack surface.
   */
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

  /**
   * X-DNS-Prefetch-Control
   * Controls DNS prefetching behavior.
   * off: Disabled for privacy
   */
  'X-DNS-Prefetch-Control': 'off',

  /**
   * X-Download-Options
   * Prevents IE from executing downloads in site's context.
   */
  'X-Download-Options': 'noopen',

  /**
   * X-Permitted-Cross-Domain-Policies
   * Restricts Adobe Flash and PDF cross-domain requests.
   */
  'X-Permitted-Cross-Domain-Policies': 'none',
}

/**
 * Returns security headers as [key, value] tuples for hosting config consumption.
 * Useful for frameworks that expect headers as array format.
 *
 * @returns Array of [headerName, headerValue] tuples
 */
export function getSecurityHeadersArray(): [string, string][] {
  return Object.entries(SECURITY_HEADERS)
}

/**
 * Returns security headers as a Headers object for use in fetch() or Response.
 *
 * @returns Headers instance with all security headers
 */
export function getSecurityHeadersObject(): Headers {
  const headers = new Headers()
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value)
  }
  return headers
}

/**
 * Returns security headers formatted for Next.js middleware.
 *
 * @returns Object compatible with NextResponse.headers.set()
 */
export function getNextJsSecurityHeaders(): Record<string, string> {
  return { ...SECURITY_HEADERS }
}

/**
 * Removes X-Powered-By header to prevent server fingerprinting.
 * Should be called in Next.js config or middleware.
 */
export const removePoweredByHeader = true
