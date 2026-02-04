import { NextRequest, NextResponse } from 'next/server'
import { YouTubeAPI } from '@/lib/youtube'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    // Edge-compatible Supabase Auth check
    // Note: createClient in 'server.ts' uses 'cookies()', which works in Edge

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
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
