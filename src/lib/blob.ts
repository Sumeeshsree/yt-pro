import { put, del } from '@vercel/blob'

export async function uploadReportPDF(
    fileName: string,
    pdfBuffer: Buffer
): Promise<string> {
    const blob = await put(fileName, pdfBuffer, {
        access: 'public',
        contentType: 'application/pdf',
    })
    return blob.url
}

export async function deleteReportPDF(url: string): Promise<void> {
    await del(url)
}
