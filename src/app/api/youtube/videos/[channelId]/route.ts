import { NextRequest, NextResponse } from 'next/server'
import { YouTubeAPI } from '@/lib/youtube'
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
        const videos = await YouTubeAPI.getChannelVideos(channelId)
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
    }
}
