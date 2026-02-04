import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { YouTubeAPI } from '@/lib/youtube'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    // Verify Cron Secret
    // Verify Cron Secret
    const headerList = await headers()
    const authHeader = headerList.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const channels = await prisma.channel.findMany()

        for (const channel of channels) {
            try {
                // Fetch latest channel stats
                const details = await YouTubeAPI.getChannelDetails(channel.channelId)
                const stats = details.items[0]?.statistics

                if (stats) {
                    // Update Channel model
                    await prisma.channel.update({
                        where: { id: channel.id },
                        data: {
                            subscriberCount: parseInt(stats.subscriberCount),
                            videoCount: parseInt(stats.videoCount),
                            viewCount: BigInt(stats.viewCount),
                        }
                    })

                    // Create Snapshot in Analytics model
                    await prisma.analytics.create({
                        data: {
                            channelId: channel.id,
                            date: new Date(),
                            subscribers: parseInt(stats.subscriberCount),
                            views: BigInt(stats.viewCount),
                            videos: parseInt(stats.videoCount),
                            // engagementRate: Calculate if possible
                        }
                    })
                }
            } catch (err) {
                console.error(`Failed to update channel ${channel.channelId}`, err)
            }
        }

        return NextResponse.json({ success: true, count: channels.length })
    } catch (error) {
        console.error('Cron job failed', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
