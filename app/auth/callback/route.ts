import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
    const { searchParams, origin } = new URL(req.url)
    const code = searchParams.get('code')

    const cookieStore = cookies()
    const role = cookieStore.get('polly_auth_role')?.value ?? 'voter'
    const redirect = cookieStore.get('polly_auth_redirect')?.value ?? ''

    console.log('1. Callback hit — code:', code, 'role:', role, 'redirect:', redirect)

    if (code) {
        const supabase = await createSupabaseServerClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        console.log('2. Exchange result — error:', error, 'user:', data?.user?.id)

        if (!error && data.user) {
            const providerData = data.user.app_metadata
            const provider = providerData.provider
            const provider_id = data.user.id
            const username =
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.user_metadata?.user_name ||
            data.user.email?.split('@')[0] ||
            'unknown'

            console.log('3. Provider data — provider:', provider, 'username:', username)

            const res = await fetch(`${origin}/api/auth/callback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider, provider_id, username, role }),
            })

            const userData = await res.json()

            console.log('4. User save result:', userData)

            if (userData.user) {
                const encoded = encodeURIComponent(JSON.stringify(userData.user))
                const redirectParam = redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''
                return NextResponse.redirect(
                    `${origin}/auth/complete?user=${encoded}${redirectParam}`
                )
            }

            console.log('5. No user in response — falling through to error')
        }
    }

    console.log('6. Falling through to error redirect')
    return NextResponse.redirect(`${origin}/auth/complete?error=auth_failed`)
}