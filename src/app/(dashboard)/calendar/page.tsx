'use client'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

const events = [
    {
        title: 'Video Upload: Tech Review',
        start: new Date(2024, 1, 12, 10, 0), // Mock date
        end: new Date(2024, 1, 12, 11, 0),
    },
]

export default function CalendarPage() {
    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-100px)]">
            <h1 className="text-3xl font-bold">Content Calendar</h1>
            <div className="flex-1 bg-white p-4 rounded-xl shadow border dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                />
            </div>
        </div>
    )
}
