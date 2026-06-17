import { describe, it, expect } from 'vitest'
import {
  SECURITY_HEADERS,
  getSecurityHeadersArray,
  getSecurityHeadersObject,
  getNextJsSecurityHeaders,
  removePoweredByHeader,
} from '@/lib/security/headers'

describe('SECURITY_HEADERS', () => {
  it('contains all required security headers', () => {
    const requiredHeaders = [
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
    ]

    requiredHeaders.forEach((header) => {
      expect(SECURITY_HEADERS).toHaveProperty(header)
    })
  })

  it('has non-empty values for all headers', () => {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      expect(value).toBeTruthy()
      expect(value.length).toBeGreaterThan(0)
      expect(typeof value).toBe('string')
    })
  })

  it('CSP includes frame-ancestors none', () => {
    const csp = SECURITY_HEADERS['Content-Security-Policy']
    expect(csp).toContain('frame-ancestors \'none\'')
  })

  it('CSP includes upgrade-insecure-requests', () => {
    const csp = SECURITY_HEADERS['Content-Security-Policy']
    expect(csp).toContain('upgrade-insecure-requests')
  })

  it('CSP blocks object-src', () => {
    const csp = SECURITY_HEADERS['Content-Security-Policy']
    expect(csp).toContain('object-src \'none\'')
  })

  it('X-Frame-Options is DENY', () => {
    expect(SECURITY_HEADERS['X-Frame-Options']).toBe('DENY')
  })

  it('HSTS includes preload', () => {
    const hsts = SECURITY_HEADERS['Strict-Transport-Security']
    expect(hsts).toContain('preload')
    expect(hsts).toContain('includeSubDomains')
    expect(hsts).toContain('max-age=31536000')
  })

  it('X-Content-Type-Options is nosniff', () => {
    expect(SECURITY_HEADERS['X-Content-Type-Options']).toBe('nosniff')
  })

  it('Referrer-Policy is set correctly', () => {
    const policy = SECURITY_HEADERS['Referrer-Policy']
    expect(policy).toBe('strict-origin-when-cross-origin')
  })

  it('Permissions-Policy disables dangerous features', () => {
    const policy = SECURITY_HEADERS['Permissions-Policy']
    expect(policy).toContain('camera=()')
    expect(policy).toContain('microphone=()')
    expect(policy).toContain('geolocation=()')
  })

  it('CSP allows required external domains', () => {
    const csp = SECURITY_HEADERS['Content-Security-Policy']
    expect(csp).toContain('pinecone.io')
    expect(csp).toContain('supabase.co')
    expect(csp).toContain('googleapis.com')
  })
})

describe('getSecurityHeadersArray', () => {
  it('returns array of [key, value] tuples', () => {
    const headers = getSecurityHeadersArray()
    expect(Array.isArray(headers)).toBe(true)
    expect(headers.length).toBeGreaterThan(0)

    headers.forEach(([key, value]) => {
      expect(typeof key).toBe('string')
      expect(typeof value).toBe('string')
      expect(key.length).toBeGreaterThan(0)
      expect(value.length).toBeGreaterThan(0)
    })
  })

  it('includes all headers from SECURITY_HEADERS', () => {
    const headers = getSecurityHeadersArray()
    const headerKeys = headers.map(([key]) => key)

    Object.keys(SECURITY_HEADERS).forEach((key) => {
      expect(headerKeys).toContain(key)
    })
  })

  it('has correct number of entries', () => {
    const headers = getSecurityHeadersArray()
    const expectedCount = Object.keys(SECURITY_HEADERS).length
    expect(headers.length).toBe(expectedCount)
  })

  it('tuple values match SECURITY_HEADERS', () => {
    const headers = getSecurityHeadersArray()

    headers.forEach(([key, value]) => {
      expect(SECURITY_HEADERS[key]).toBe(value)
    })
  })
})

describe('getSecurityHeadersObject', () => {
  it('returns Headers instance', () => {
    const headers = getSecurityHeadersObject()
    expect(headers).toBeInstanceOf(Headers)
  })

  it('contains all security headers', () => {
    const headers = getSecurityHeadersObject()

    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      expect(headers.get(key)).toBe(value)
    })
  })

  it('has correct number of headers', () => {
    const headers = getSecurityHeadersObject()
    let count = 0
    headers.forEach(() => {
      count++
    })
    expect(count).toBe(Object.keys(SECURITY_HEADERS).length)
  })
})

describe('getNextJsSecurityHeaders', () => {
  it('returns object with all security headers', () => {
    const headers = getNextJsSecurityHeaders()
    expect(typeof headers).toBe('object')
    expect(headers).not.toBeNull()
  })

  it('contains all headers from SECURITY_HEADERS', () => {
    const headers = getNextJsSecurityHeaders()

    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      expect(headers[key]).toBe(value)
    })
  })

  it('is a plain object, not an instance', () => {
    const headers = getNextJsSecurityHeaders()
    expect(Object.getPrototypeOf(headers)).toBe(Object.prototype)
  })
})

describe('removePoweredByHeader', () => {
  it('is set to true', () => {
    expect(removePoweredByHeader).toBe(true)
  })

  it('is a boolean', () => {
    expect(typeof removePoweredByHeader).toBe('boolean')
  })
})
