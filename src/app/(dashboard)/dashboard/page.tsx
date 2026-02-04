export default function DashboardPage() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Metrics Cards will go here */}
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Total Subscribers</h3>
                </div>
                <div className="text-2xl font-bold">--</div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Total Views</h3>
                </div>
                <div className="text-2xl font-bold">--</div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Total Videos</h3>
                </div>
                <div className="text-2xl font-bold">--</div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Engagement Rate</h3>
                </div>
                <div className="text-2xl font-bold">--</div>
            </div>
        </div>
    )
}
