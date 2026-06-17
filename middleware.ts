import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SECURITY_HEADERS } from '@/lib/security/headers'

/**
 * Next.js Middleware - applies security headers to all responses
 * Runs on every request before the response is sent
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Apply all security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Remove X-Powered-By to prevent server fingerprinting
  response.headers.delete('X-Powered-By')

  return response
}

/**
 * Configure which routes this middleware applies to
 * Match all routes except static files and Next.js internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
