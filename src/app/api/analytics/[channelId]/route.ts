import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ channelId: string }> }
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { channelId } = await params

    try {
        const { data: channel, error: channelError } = await supabase
            .from('channels')
            .select('id, channel_id')
            .or(`id.eq.${channelId},channel_id.eq.${channelId}`)
            .eq('user_id', user.id)
            .single()

        if (channelError || !channel) {
            return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
        }

        const { data: history, error: historyError } = await supabase
            .from('analytics')
            .select('*')
            .eq('channel_id', channel.id)
            .order('date', { ascending: true })
            .limit(30)

        if (historyError) throw historyError

        return NextResponse.json(history)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
