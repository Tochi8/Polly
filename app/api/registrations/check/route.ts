import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const user_id = searchParams.get('user_id')
        const poll_id = searchParams.get('poll_id')

        if (!user_id || !poll_id) {
            return NextResponse.json(
                { error: 'user_id and poll_id are required' },
                { status: 400 }
            )
        }

        const { data: registration, error: dbError } = await supabase
    .from('registrations')
    .select('id')
    .eq('user_id', user_id)
    .eq('poll_id', poll_id)
    .maybeSingle() 

return NextResponse.json({ isRegistered: !!registration })
    } catch (error) {
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        )
    }
}