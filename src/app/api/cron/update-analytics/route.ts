import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { YouTubeAPI } from '@/lib/youtube'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const headerList = await headers()
    const authHeader = headerList.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabase = createAdminClient()

    try {
        const { data: channels, error } = await supabase.from('channels').select('*')
        if (error) throw error

        for (const channel of channels) {
            try {
                const details = await YouTubeAPI.getChannelDetails(channel.channel_id) // snake_case in DB
                const stats = details.items[0]?.statistics

                if (stats) {
                    // Update Channel
                    await supabase.from('channels')
                        .update({
                            subscriber_count: parseInt(stats.subscriberCount),
                            video_count: parseInt(stats.videoCount),
                            view_count: BigInt(stats.viewCount), // Supabase JS handles BigInt? Might need string
                        })
                        .eq('id', channel.id)

                    // Create Snapshot
                    await supabase.from('analytics')
                        .insert({
                            channel_id: channel.id,
                            date: new Date().toISOString(),
                            subscribers: parseInt(stats.subscriberCount),
                            views: BigInt(stats.viewCount), // Check BigInt support
                            videos: parseInt(stats.videoCount),
                        })
                }
            } catch (err) {
                console.error(`Failed to update channel ${channel.channel_id}`, err)
            }
        }

        return NextResponse.json({ success: true, count: channels.length })
    } catch (error) {
        console.error('Cron job failed', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
