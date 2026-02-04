'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Plus } from 'lucide-react'

export default function ReportsPage() {
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        const res = await fetch('/api/reports')
        if (res.ok) {
            const data = await res.json()
            setReports(data)
        }
    }

    const handleGenerateReport = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'MONTHLY' }), // Example type
            })
            if (res.ok) {
                fetchReports()
            } else {
                alert('Failed to generate report')
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Reports</h1>
                <Button onClick={handleGenerateReport} disabled={loading}>
                    {loading ? 'Generating...' : <><Plus className="mr-2 h-4 w-4" /> New Report</>}
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reports.map((report) => (
                    <Card key={report.id}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="h-8 w-8 text-primary" />
                            </div>
                            <div className="grid gap-1">
                                <CardTitle className="text-base">{report.reportType} Report</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" asChild>
                                <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {reports.length === 0 && <p className="text-muted-foreground">No reports generated yet.</p>}
            </div>
        </div>
    )
}
