import { kv } from '@vercel/kv'

export async function getCachedChannelData(channelId: string) {
    try {
        return await kv.get(`channel:${channelId}`)
    } catch (error) {
        console.warn('KV Error', error)
        return null;
    }
}

export async function setCachedChannelData(channelId: string, data: any) {
    try {
        await kv.set(`channel:${channelId}`, data, { ex: 86400 }) // 24 hours
    } catch (error) {
        console.warn('KV Error', error)
    }
}
