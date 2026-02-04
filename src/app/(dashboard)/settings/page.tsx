export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <h3 className="font-semibold mb-4">Account Settings</h3>
                <p className="text-sm text-muted-foreground">Manage your account preferences and API keys.</p>

                <div className="mt-4 space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">YouTube API Key (Optional Override)</label>
                        <input type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Enter your API Key" />
                    </div>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}
