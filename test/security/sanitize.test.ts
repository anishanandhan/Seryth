import { describe, it, expect } from 'vitest'
import {
  sanitizeInput,
  escapeHtml,
  redactSecrets,
  isSafeString,
  stripHtml,
  sanitizeUrl,
  sanitizeUserInput,
} from '@/lib/security/sanitize'

describe('sanitizeInput', () => {
  it('removes control characters', () => {
    const input = 'Hello\u0000\u0001\u0008World'
    const result = sanitizeInput(input)
    expect(result).toBe('HelloWorld')
  })

  it('preserves newlines and tabs', () => {
    const input = 'Hello\nWorld\tTest'
    const result = sanitizeInput(input)
    expect(result).toBe('Hello\nWorld\tTest')
  })

  it('removes zero-width characters', () => {
    const input = 'Hello\u200BWorld\uFEFF'
    const result = sanitizeInput(input)
    expect(result).toBe('HelloWorld')
  })

  it('removes bidirectional override characters', () => {
    const input = 'Hello\u202AWorld\u202E'
    const result = sanitizeInput(input)
    expect(result).toBe('HelloWorld')
  })

  it('applies Unicode NFC normalization', () => {
    const input = 'café' // e + combining accent
    const result = sanitizeInput(input)
    expect(result).toBe('café') // single é character
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null as any)).toBe('')
    expect(sanitizeInput(undefined as any)).toBe('')
    expect(sanitizeInput(123 as any)).toBe('')
    expect(sanitizeInput({} as any)).toBe('')
  })

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('')
  })

  it('preserves valid text unchanged', () => {
    const input = 'This is valid text with spaces and punctuation!'
    const result = sanitizeInput(input)
    expect(result).toBe(input)
  })
})

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B')
  })

  it('escapes less-than and greater-than', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    )
  })

  it('escapes double quotes', () => {
    expect(escapeHtml('Say "hello"')).toBe('Say &quot;hello&quot;')
  })

  it('escapes single quotes', () => {
    expect(escapeHtml("It's mine")).toBe('It&#x27;s mine')
  })

  it('escapes forward slash', () => {
    expect(escapeHtml('</script>')).toBe('&lt;&#x2F;script&gt;')
  })

  it('escapes XSS payload with onerror', () => {
    const xss = '<img src=x onerror="alert(1)">'
    const escaped = escapeHtml(xss)
    expect(escaped).not.toContain('<')
    expect(escaped).not.toContain('>')
    expect(escaped).not.toContain('"')
  })

  it('escapes javascript: protocol', () => {
    const payload = '<a href="javascript:alert(1)">Click</a>'
    const escaped = escapeHtml(payload)
    expect(escaped).not.toContain('<')
    expect(escaped).not.toContain('>')
  })

  it('returns empty string for non-string input', () => {
    expect(escapeHtml(null as any)).toBe('')
    expect(escapeHtml(undefined as any)).toBe('')
  })

  it('preserves safe text unchanged', () => {
    const input = 'Hello World 123'
    expect(escapeHtml(input)).toBe(input)
  })

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('')
  })
})

describe('redactSecrets', () => {
  it('redacts API keys starting with sk-', () => {
    const input = 'My key is sk-abc123def456ghi789jkl012'
    const result = redactSecrets(input)
    expect(result).toBe('My key is [REDACTED]')
  })

  it('redacts API keys starting with pk-', () => {
    const input = 'Public key: pk-test1234567890abcdef'
    const result = redactSecrets(input)
    expect(result).toBe('Public key: [REDACTED]')
  })

  it('redacts API keys starting with key-', () => {
    const input = 'key-abcdefghijklmnop'
    const result = redactSecrets(input)
    expect(result).toBe('[REDACTED]')
  })

  it('redacts Bearer tokens', () => {
    const input = 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    const result = redactSecrets(input)
    expect(result).toBe('Authorization: Bearer [REDACTED]')
  })

  it('redacts email addresses', () => {
    const input = 'Contact: user@example.com for help'
    const result = redactSecrets(input)
    expect(result).toBe('Contact: [REDACTED_EMAIL] for help')
  })

  it('redacts JWT tokens', () => {
    const input = 'Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'
    const result = redactSecrets(input)
    expect(result).toContain('[REDACTED')
  })

  it('redacts password fields', () => {
    const input = 'password=mySecretPass123'
    const result = redactSecrets(input)
    expect(result).toBe('password=[REDACTED]')
  })

  it('redacts secret fields', () => {
    const input = 'secret: my-secret-value'
    const result = redactSecrets(input)
    expect(result).toBe('secret: [REDACTED]')
  })

  it('redacts token fields', () => {
    const input = 'token=abc123def456'
    const result = redactSecrets(input)
    expect(result).toBe('token=[REDACTED]')
  })

  it('handles multiple secrets in one string', () => {
    const input = 'User email@test.com with key sk-abc123def456ghi789 and password=secret'
    const result = redactSecrets(input)
    expect(result).not.toContain('email@test.com')
    expect(result).not.toContain('sk-abc123')
    expect(result).not.toContain('secret')
  })

  it('returns empty string for non-string input', () => {
    expect(redactSecrets(null as any)).toBe('')
    expect(redactSecrets(undefined as any)).toBe('')
  })

  it('preserves safe text unchanged', () => {
    const input = 'This is safe text without secrets'
    expect(redactSecrets(input)).toBe(input)
  })
})

describe('isSafeString', () => {
  it('returns true for valid alphanumeric string', () => {
    expect(isSafeString('Hello123')).toBe(true)
  })

  it('returns true for string with spaces', () => {
    expect(isSafeString('Hello World')).toBe(true)
  })

  it('returns true for string with common punctuation', () => {
    expect(isSafeString('Hello, World!')).toBe(true)
    expect(isSafeString('Test-Name_123')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(isSafeString('')).toBe(false)
  })

  it('returns false for string exceeding maxLength', () => {
    const longString = 'a'.repeat(101)
    expect(isSafeString(longString, 100)).toBe(false)
  })

  it('returns false for string with special characters', () => {
    expect(isSafeString('Hello<script>')).toBe(false)
    expect(isSafeString('Test\u0000')).toBe(false)
  })

  it('returns false for non-string input', () => {
    expect(isSafeString(null as any)).toBe(false)
    expect(isSafeString(undefined as any)).toBe(false)
    expect(isSafeString(123 as any)).toBe(false)
  })

  it('respects custom maxLength', () => {
    expect(isSafeString('Hello', 5)).toBe(true)
    expect(isSafeString('Hello', 4)).toBe(false)
  })
})

describe('stripHtml', () => {
  it('removes simple HTML tags', () => {
    expect(stripHtml('<p>Hello</p>')).toBe('Hello')
  })

  it('removes nested HTML tags', () => {
    expect(stripHtml('<div><span>Hello</span></div>')).toBe('Hello')
  })

  it('removes self-closing tags', () => {
    expect(stripHtml('Hello <br/> World')).toBe('Hello  World')
  })

  it('removes tags with attributes', () => {
    expect(stripHtml('<a href="https://evil.com">Click</a>')).toBe('Click')
  })

  it('handles multiple tags', () => {
    expect(stripHtml('<p>Para 1</p><p>Para 2</p>')).toBe('Para 1Para 2')
  })

  it('returns empty string for non-string input', () => {
    expect(stripHtml(null as any)).toBe('')
    expect(stripHtml(undefined as any)).toBe('')
  })

  it('preserves text without tags', () => {
    expect(stripHtml('Plain text')).toBe('Plain text')
  })
})

describe('sanitizeUrl', () => {
  it('accepts valid HTTP URL', () => {
    const result = sanitizeUrl('http://example.com')
    expect(result).toBe('http://example.com/')
  })

  it('accepts valid HTTPS URL', () => {
    const result = sanitizeUrl('https://example.com')
    expect(result).toBe('https://example.com/')
  })

  it('rejects javascript: protocol', () => {
    const result = sanitizeUrl('javascript:alert(1)')
    expect(result).toBeNull()
  })

  it('rejects data: protocol', () => {
    const result = sanitizeUrl('data:text/html,<script>alert(1)</script>')
    expect(result).toBeNull()
  })

  it('rejects file: protocol', () => {
    const result = sanitizeUrl('file:///etc/passwd')
    expect(result).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(sanitizeUrl('')).toBeNull()
  })

  it('returns null for non-string input', () => {
    expect(sanitizeUrl(null as any)).toBeNull()
    expect(sanitizeUrl(undefined as any)).toBeNull()
  })

  it('returns null for invalid URL', () => {
    expect(sanitizeUrl('not a url')).toBeNull()
  })

  it('trims whitespace', () => {
    const result = sanitizeUrl('  https://example.com  ')
    expect(result).toBe('https://example.com/')
  })
})

describe('sanitizeUserInput', () => {
  it('combines sanitization, HTML stripping, and escaping', () => {
    const input = '<script>alert("xss")</script>Hello\u0000World'
    const result = sanitizeUserInput(input)
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('\u0000')
  })

  it('limits string length', () => {
    const input = 'a'.repeat(300)
    const result = sanitizeUserInput(input, 200)
    expect(result.length).toBe(200)
  })

  it('trims whitespace', () => {
    const input = '  Hello World  '
    const result = sanitizeUserInput(input)
    expect(result).toBe('Hello World')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeUserInput(null as any)).toBe('')
    expect(sanitizeUserInput(undefined as any)).toBe('')
  })

  it('handles fragrance names safely', () => {
    const input = 'Midnight<script>alert(1)</script>Peony'
    const result = sanitizeUserInput(input)
    expect(result).not.toContain('<script>')
  })
})
