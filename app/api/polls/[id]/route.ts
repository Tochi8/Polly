import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params: {id: string}}) {

    try {

        const {id} = params

        const {data: polls, error} = await supabase
        .from('polls')
        .select('*, candidates(*)')
        .eq('id', id)
        .single()

        if(error) {
            return NextResponse.json({error: error.message}, {status: 500})
        }

        if(!polls) {
            return NextResponse.json({error: polls.message}, {status: 404})
        }

        return NextResponse.json({polls})
        
    } catch (error) {
        return NextResponse.json({error: 'Failed to fetch poll, please try again'} , {status: 500})
    }
}

export async function PATCH(req: Request, {params}: {params: {id: string}}) {

    try {

        const {id} = params

        const {title, description, status, results_public} = await req.json()

        const {data: updatedPoll, error} = await supabase
        .from('polls')
        .update({title, description, status, results_public})
        .eq('id', id)
        .select('*')
        .single()

        if (error) {
            return NextResponse.json({error: error.message}, {status: 500})
        }

        if (!updatedPoll) {
            return NextResponse.json({error: 'Poll not found'}, {status: 404})
        }

        return NextResponse.json({poll: updatedPoll})

    } catch (error) {
        return NextResponse.json({error: 'Failed to update poll, please try again'}, {status: 500})
    }
}

export async function DELETE(req: Request, {params}: {params: {id: string}}) {

    try {
         const {id} = params

    const {data: deletedPoll, error} = await supabase
    .from('polls')
    .delete()
    .eq('id', id)

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

    return NextResponse.json({message: 'Poll deleted successfully'})

    } catch (error) {
        return NextResponse.json({error: 'Failed to delete poll, please try again'}, {status: 500})
    }
}