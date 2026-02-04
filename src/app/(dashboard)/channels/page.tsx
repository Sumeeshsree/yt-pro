'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Search } from 'lucide-react'
// import { useToast } from '@/hooks/use-toast'

export default function ChannelsPage() {
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [savedChannels, setSavedChannels] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchChannels()
    }, [])

    const fetchChannels = async () => {
        const res = await fetch('/api/channels')
        if (res.ok) {
            const data = await res.json()
            setSavedChannels(data)
        }
    }

    const handleSearch = async () => {
        if (!query) return
        setLoading(true)
        try {
            const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
            const data = await res.json()
            setSearchResults(data.items || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveChannel = async (channel: any) => {
        try {
            const res = await fetch('/api/channels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channelId: channel.id.channelId,
                    channelName: channel.snippet.title,
                    channelHandle: channel.snippet.customUrl || '',
                    thumbnail: channel.snippet.thumbnails.default.url,
                }),
            })

            if (res.ok) {
                setSearchResults([])
                setQuery('')
                fetchChannels()
            } else {
                alert('Failed to save channel')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Channels</h1>
            </div>

            <div className="flex gap-2">
                <Input
                    placeholder="Search YouTube Channels..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : <Search className="h-4 w-4 mr-2" />}
                    Search
                </Button>
            </div>

            {searchResults.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {searchResults.map((item) => (
                        <Card key={item.id.channelId}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.snippet.thumbnails.default.url} alt={item.snippet.title} className="h-10 w-10 rounded-full" />
                                <div className="grid gap-1">
                                    <CardTitle className="text-base">{item.snippet.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" size="sm" onClick={() => handleSaveChannel(item)}>
                                    <Plus className="h-4 w-4 mr-2" /> Connect
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <h2 className="text-xl font-semibold mt-8">Connected Channels</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedChannels.map((channel) => (
                    <Card key={channel.id}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={channel.thumbnail} alt={channel.channelName} className="h-10 w-10 rounded-full" />
                            <div className="grid gap-1">
                                <CardTitle className="text-base">{channel.channelName}</CardTitle>
                                <p className="text-xs text-muted-foreground">Subscribers: {channel.subscriberCount || 0}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Future: Add delete button */}
                            <Button variant="outline" size="sm" className="w-full">
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {savedChannels.length === 0 && <p className="text-muted-foreground">No channels connected yet.</p>}
            </div>
        </div>
    )
}
