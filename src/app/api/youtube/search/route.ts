import { NextRequest, NextResponse } from 'next/server'
import { YouTubeAPI } from '@/lib/youtube'
import { auth } from '@/auth'

export const runtime = 'edge' // Edge runtime as requested

export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    try {
        const data = await YouTubeAPI.searchChannels(query)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Search Route Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
