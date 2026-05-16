import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const community_id = searchParams.get('community_id')
    const user_id = searchParams.get('user_id')

    if (!community_id || !user_id) {
      return NextResponse.json(
        { error: 'community_id and user_id are required' },
        { status: 400 }
      )
    }

    const { data: membership } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', community_id)
      .eq('user_id', user_id)
      .maybeSingle()

    return NextResponse.json({ isMember: !!membership })

  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}