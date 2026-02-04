import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { createClient } from '@/lib/supabase/server'
import { uploadReportPDF } from '@/lib/blob'

// POST: Generate a new report
export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
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

        // 2. Upload to Vercel Blob (keeping as requested, or switch to Supabase Storage?)
        // User didn't explicitly ask to change storage, but Supabase *has* storage.
        // Let's stick to Vercel Blob for minimal friction unless user asked, but...
        // mixing Supabase and Vercel Blob is fine.

        // NOTE: 'uploadReportPDF' uses 'put' from '@vercel/blob'. 
        // Just ensure BLOB_READ_WRITE_TOKEN is set.
        const filename = `report-${user.id}-${Date.now()}.pdf`
        const fileUrl = await uploadReportPDF(filename, pdfBuffer)

        // 3. Save to DB
        const { data: channel } = await supabase
            .from('channels')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)
            .single()

        if (!channel) return NextResponse.json({ error: 'No channels found' }, { status: 400 })

        const { data: report, error } = await supabase
            .from('reports')
            .insert({
                user_id: user.id,
                channel_id: channel.id,
                report_type: 'MONTHLY',
                date_from: new Date().toISOString(),
                date_to: new Date().toISOString(),
                data: {},
                file_url: fileUrl, // snake_case in DB
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(report)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// GET: List reports
export async function GET(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Map snake_case to camelCase for frontend? 
    // Frontend expects 'reportType' etc.
    // Or just update frontend to use snake_case or generated types.
    // For simplicity, I'll map it here or let frontend adapt.
    // Given I am "Agentic", I should probably update the Frontend to match new DB schema 
    // OR map it here. Mapping is safer to avoid touching too many UI files.

    const mappedReports = reports.map(r => ({
        ...r,
        reportType: r.report_type,
        fileUrl: r.file_url,
        createdAt: r.created_at
    }))

    return NextResponse.json(mappedReports)
}
