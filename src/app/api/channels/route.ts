import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { z } from 'zod'

const CreateChannelSchema = z.object({
    channelId: z.string(),
    channelName: z.string(),
    channelHandle: z.string().optional(),
    thumbnail: z.string().optional(),
})

export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const channels = await prisma.channel.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(channels)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const json = await req.json()
        const body = CreateChannelSchema.parse(json)

        const existing = await prisma.channel.findFirst({
            where: {
                userId: session.user.id,
                channelId: body.channelId
            }
        })

        if (existing) {
            return NextResponse.json({ error: 'Channel already connected' }, { status: 400 })
        }

        const channel = await prisma.channel.create({
            data: {
                userId: session.user.id,
                ...body,
            }
        })

        return NextResponse.json(channel)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
