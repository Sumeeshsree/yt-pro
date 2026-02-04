import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ channelId: string }> }
) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { channelId } = await params

    try {
        // Fetch analytics history from DB
        // channelId here is the database ID or youtube channel ID? 
        // Let's assume database ID for relational query, or search by channelId string

        // Try finding by ID first
        const channel = await prisma.channel.findFirst({
            where: {
                OR: [
                    { id: channelId },
                    { channelId: channelId }
                ],
                userId: session.user?.id
            }
        })

        if (!channel) return NextResponse.json({ error: 'Channel not found' }, { status: 404 })

        const history = await prisma.analytics.findMany({
            where: { channelId: channel.id },
            orderBy: { date: 'asc' },
            take: 30 // Last 30 records
        })

        return NextResponse.json(history)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
