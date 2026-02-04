import { NextRequest, NextResponse } from 'next/server'
import { YouTubeAPI } from '@/lib/youtube'
import { auth } from '@/auth'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ channelId: string }> }
) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // params.channelId is the YouTube Channel ID (e.g. UC...)
    // OR the database ID? The route path suggests .../videos/[channelId]
    // Let's assume it's the YT Channel ID passed from frontend

    const { channelId } = await params

    try {
        const videos = await YouTubeAPI.getChannelVideos(channelId)
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
    }
}
