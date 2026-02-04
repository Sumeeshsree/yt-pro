'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Radio, BarChart3, CalendarDays, FileText, Settings, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Channels', href: '/channels', icon: Radio },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <>
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link className="flex items-center gap-2 font-semibold" href="/">
                            <span className="">YouTube Pro</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                                        pathname === item.href ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}

export function MobileSidebar() {
    const pathname = usePathname()
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                        <span className="sr-only">YouTube Pro</span>
                    </Link>
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                                pathname === item.href ? "bg-muted text-foreground" : ""
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
