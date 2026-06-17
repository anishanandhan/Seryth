import { NextResponse } from 'next/server'

// Scent Vault profile storage
// In production, this would use Supabase. For demo, using in-memory store.
const vaultStore = new Map<string, Record<string, unknown>>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, profile } = body

    switch (action) {
      case 'save': {
        if (!profile || !profile.id) {
          return NextResponse.json(
            { error: 'Profile with ID is required' },
            { status: 400 }
          )
        }

        // Try Supabase first, fall back to in-memory
        try {
          const { getSupabaseServer } = await import('@/lib/supabase')
          const supabase = getSupabaseServer()

          const { error } = await supabase.from('scent_profiles').upsert({
            vault_id: profile.id,
            user_name: profile.userName,
            vector: profile.vector,
            archetype: profile.archetype,
            matches: profile.matches,
            quiz_answers: profile.quizAnswers,
            created_at: profile.createdAt || new Date().toISOString(),
          })

          if (error) throw error

          return NextResponse.json({
            success: true,
            message: `Profile ${profile.id} saved to Supabase`,
          })
        } catch (supabaseError) {
          console.warn('Supabase unavailable, using in-memory store:', supabaseError)
          vaultStore.set(profile.id, profile)

          return NextResponse.json({
            success: true,
            message: `Profile ${profile.id} saved to in-memory store (demo mode)`,
          })
        }
      }

      case 'load': {
        const { vaultId } = body
        if (!vaultId) {
          return NextResponse.json(
            { error: 'vaultId is required' },
            { status: 400 }
          )
        }

        try {
          const { getSupabaseServer } = await import('@/lib/supabase')
          const supabase = getSupabaseServer()

          const { data, error } = await supabase
            .from('scent_profiles')
            .select('*')
            .eq('vault_id', vaultId)
            .single()

          if (error) throw error

          return NextResponse.json({ success: true, profile: data })
        } catch {
          // Fallback to in-memory
          const stored = vaultStore.get(vaultId)
          if (stored) {
            return NextResponse.json({ success: true, profile: stored })
          }
          return NextResponse.json(
            { error: 'Profile not found' },
            { status: 404 }
          )
        }
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "save" or "load".' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Profile error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
