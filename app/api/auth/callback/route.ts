import {supabase} from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {

    try {
         const {provider, provider_id, username, role} = await req.json()

         const {data: existingUser} = await supabase
         .from('users')
         .select('*')
         .eq('provider', provider)
         .eq('provider_id', provider_id)
         .single()

         if(existingUser) {
            return NextResponse.json({user: existingUser})
         }

         const {data: newUser, error} = await supabase
         .from('users')
         .insert({provider, provider_id, username, role})
         .select()
         .single()

         if(error) {
            return NextResponse.json({error: error.message},  {status: 500})
           
         }

         return NextResponse.json({user: newUser})

    } catch (error) {
        return NextResponse.json({error: 'Something went wrong'},  {status: 500})
    }
}