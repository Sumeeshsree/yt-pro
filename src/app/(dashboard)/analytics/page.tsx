import { AnalyticsChart } from '@/components/analytics/AnalyticsChart'

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Analytics Deep Dive</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <AnalyticsChart />
                <div className="col-span-3 grid gap-4">
                    {/* Top Videos List Placeholder */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold mb-4">Top Videos</h3>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Video 1 Performance...</p>
                            <p className="text-sm text-muted-foreground">Video 2 Performance...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
