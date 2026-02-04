import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: channels, error } = await supabase
        .from('channels')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(channels)
}

export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        // Minimal validation
        if (!body.channelId) throw new Error("Missing channelId")

        const { data, error } = await supabase
            .from('channels')
            .insert({
                user_id: user.id,
                channel_id: body.channelId,
                channel_name: body.channelName,
                channel_handle: body.channelHandle,
                thumbnail: body.thumbnail
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') { // Unique constraint
                return NextResponse.json({ error: 'Channel already connected' }, { status: 400 })
            }
            throw error
        }

        return NextResponse.json(data)
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
