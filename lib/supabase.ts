import { createClient } from '@supabase/supabase-js'

// Server-side client (for API routes)
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase environment variables are not set')
  }

  return createClient(url, key)
}

// Browser-side client (for client components)
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return null in browser if not configured (graceful degradation)
    return null
  }

  return createClient(url, key)
}
