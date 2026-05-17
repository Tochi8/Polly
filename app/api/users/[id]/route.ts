import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Account deleted successfully' })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete account, please try again' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { username, notification_preferences } = await req.json()

    const updateData: any = {}
    if (username !== undefined) updateData.username = username
    if (notification_preferences !== undefined) updateData.notification_preferences = notification_preferences

    const { data: updatedUser, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}