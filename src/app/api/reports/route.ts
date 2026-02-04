import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { uploadReportPDF } from '@/lib/blob'

// POST: Generate a new report
export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 1. Generate PDF
        const pdfDoc = await PDFDocument.create()
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
        const page = pdfDoc.addPage()
        const { width, height } = page.getSize()

        page.drawText('YouTube Analytics Report', {
            x: 50,
            y: height - 50,
            size: 30,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        })

        page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
            x: 50,
            y: height - 100,
            size: 15,
            font: timesRomanFont,
        })

        const pdfBytes = await pdfDoc.save()
        const pdfBuffer = Buffer.from(pdfBytes)

        // 2. Upload to Vercel Blob
        const filename = `report-${session.user.id}-${Date.now()}.pdf`
        const fileUrl = await uploadReportPDF(filename, pdfBuffer)

        // 3. Save to DB
        // Need a channelId? Let's assume global report or pick first channel for now
        const channel = await prisma.channel.findFirst({ where: { userId: session.user.id } })

        if (!channel) return NextResponse.json({ error: 'No channels found' }, { status: 400 })

        const report = await prisma.report.create({
            data: {
                userId: session.user.id,
                channelId: channel.id,
                reportType: 'MONTHLY',
                dateFrom: new Date(), // Mock dates
                dateTo: new Date(),
                data: {},
                fileUrl: fileUrl,
            }
        })

        return NextResponse.json(report)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// GET: List reports
export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reports = await prisma.report.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reports)
}
