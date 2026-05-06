import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams, origin } = new URL(req.url)
    const code = searchParams.get('code')
    const role = searchParams.get('state') ?? 'voter'

    if (code) {
        const supabase = await createSupabaseServerClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            const providerData = data.user.app_metadata
            const provider = providerData.provider
            const provider_id = data.user.id
            const username =
                data.user.user_metadata?.full_name ||
                data.user.user_metadata?.user_name ||
                data.user.email ||
                'unknown'

            // Save to your users table
            const res = await fetch(`${origin}/api/auth/callback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider, provider_id, username, role }),
            })

            const userData = await res.json()

            if (userData.user) {
                // Encode user and redirect to login page to save to localStorage
                const encoded = encodeURIComponent(JSON.stringify(userData.user))
                return NextResponse.redirect(
                    `${origin}/login?user=${encoded}&role=${role}`
                )
            }
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}