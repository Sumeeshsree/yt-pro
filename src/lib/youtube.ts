const BASE_URL = 'https://www.googleapis.com/youtube/v3'

export const YouTubeAPI = {
    searchChannels: async (query: string) => {
        const params = new URLSearchParams({
            part: 'snippet',
            q: query,
            type: 'channel',
            key: process.env.YOUTUBE_API_KEY!,
            maxResults: '5',
        })

        const res = await fetch(`${BASE_URL}/search?${params}`)
        if (!res.ok) throw new Error('YouTube API Search Failed')
        return res.json()
    },

    getChannelDetails: async (channelId: string) => {
        const params = new URLSearchParams({
            part: 'snippet,statistics,brandingSettings',
            id: channelId,
            key: process.env.YOUTUBE_API_KEY!,
        })

        const res = await fetch(`${BASE_URL}/channels?${params}`)
        if (!res.ok) throw new Error('YouTube API Channel Details Failed')
        return res.json()
    },

    getChannelVideos: async (channelId: string, maxResults = 10) => {
        // 1. Get Uploads playlist ID
        const channelRes = await YouTubeAPI.getChannelDetails(channelId)
        const uploadsPlaylistId = channelRes.items[0]?.contentDetails?.relatedPlaylists?.uploads

        if (!uploadsPlaylistId) return null

        // 2. Get Videos from Playlist
        const params = new URLSearchParams({
            part: 'snippet',
            playlistId: uploadsPlaylistId,
            maxResults: String(maxResults),
            key: process.env.YOUTUBE_API_KEY!,
        })

        const res = await fetch(`${BASE_URL}/playlistItems?${params}`)
        if (!res.ok) throw new Error('YouTube API Playlist Items Failed')
        return res.json()
    }
}
