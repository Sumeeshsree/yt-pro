'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data for now, until we have real historical data
const data = [
    { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
]

export function AnalyticsChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#8884d8"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
