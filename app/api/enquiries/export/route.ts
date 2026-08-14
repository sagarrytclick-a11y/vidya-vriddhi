import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireCanViewLeads } from '@/lib/auth'
import type { EnquiryStatus } from '@prisma/client'

const MAX_ROWS = 5000

type EnquiryRow = {
  name: string
  email: string
  phone: string | null
  city: string | null
  category: string | null
  status: string
  createdAt: Date
}

function buildWhere(search: string, status: string, city: string) {
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status && ['PENDING', 'RESOLVED', 'FOLLOW_UP'].includes(status)) {
    where.status = status as EnquiryStatus
  }

  if (city) {
    where.city = { equals: city, mode: 'insensitive' }
  }

  return where
}

function formatStatus(status: string) {
  if (status === 'RESOLVED') return 'Fulfilled'
  if (status === 'FOLLOW_UP') return 'Follow Up'
  return 'Pending'
}

function formatDate(date: Date) {
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

function toCsv(rows: EnquiryRow[]) {
  const header = ['Name', 'Email', 'Phone', 'State/City', 'Category', 'Status', 'Created']
  const lines = [
    header.join(','),
    ...rows.map((row) =>
      [
        csvEscape(row.name),
        csvEscape(row.email),
        csvEscape(row.phone || ''),
        csvEscape(row.city || ''),
        csvEscape(row.category || ''),
        csvEscape(formatStatus(row.status)),
        csvEscape(formatDate(row.createdAt)),
      ].join(',')
    ),
  ]
  return `\uFEFF${lines.join('\n')}`
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function toExcelXml(rows: EnquiryRow[]) {
  const cells = (values: string[]) =>
    values
      .map((v) => `<Cell><Data ss:Type="String">${xmlEscape(v)}</Data></Cell>`)
      .join('')

  const body = rows
    .map(
      (row) =>
        `<Row>${cells([
          row.name,
          row.email,
          row.phone || '',
          row.city || '',
          row.category || '',
          formatStatus(row.status),
          formatDate(row.createdAt),
        ])}</Row>`
    )
    .join('')

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Enquiries">
<Table>
<Row>${cells(['Name', 'Email', 'Phone', 'State/City', 'Category', 'Status', 'Created'])}</Row>
${body}
</Table>
</Worksheet>
</Workbook>`
}

function pdfEscape(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function toPdf(rows: EnquiryRow[]) {
  const title = 'VidyaVriddhi Enquiries'
  const lineHeight = 14
  const startY = 800
  const maxRows = Math.min(rows.length, 48)
  const contentRows = rows.slice(0, maxRows)

  const lines: string[] = [`BT /F1 16 Tf 40 ${startY} Td (${pdfEscape(title)}) Tj ET`]
  lines.push(`BT /F1 9 Tf 40 ${startY - 22} Td (${pdfEscape(`Total: ${rows.length} (showing ${contentRows.length})`)}) Tj ET`)

  const headers = 'Name | Email | Phone | City | Status'
  lines.push(`BT /F1 8 Tf 40 ${startY - 44} Td (${pdfEscape(headers)}) Tj ET`)

  contentRows.forEach((row, i) => {
    const y = startY - 62 - i * lineHeight
    if (y < 40) return
    const line = [
      row.name.slice(0, 18),
      row.email.slice(0, 24),
      (row.phone || '-').slice(0, 14),
      (row.city || '-').slice(0, 12),
      formatStatus(row.status),
    ].join(' | ')
    lines.push(`BT /F1 8 Tf 40 ${y} Td (${pdfEscape(line)}) Tj ET`)
  })

  const stream = lines.join('\n')
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj',
    `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
  ]

  let offset = 9
  const xref = ['0000000000 65535 f ']
  const parts = ['%PDF-1.4']
  for (const obj of objects) {
    xref.push(`${offset.toString().padStart(10, '0')} 00000 n `)
    parts.push(obj)
    offset += obj.length + 1
  }
  const xrefStart = offset
  parts.push(`xref\n0 ${objects.length + 1}\n${xref.join('\n')}`)
  parts.push(`trailer << /Size ${objects.length + 1} /Root 1 0 R >>`)
  parts.push(`startxref\n${xrefStart}\n%%EOF`)
  return parts.join('\n')
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireCanViewLeads(request)
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const format = (searchParams.get('format') || 'csv').toLowerCase()
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const city = searchParams.get('city') || ''

    if (!['csv', 'xlsx', 'xls', 'pdf'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    const enquiries = await db.enquiry.findMany({
      where: buildWhere(search, status, city),
      orderBy: { createdAt: 'desc' },
      take: MAX_ROWS,
      select: {
        name: true,
        email: true,
        phone: true,
        city: true,
        category: true,
        status: true,
        createdAt: true,
      },
    })

    const stamp = new Date().toISOString().slice(0, 10)
    const filenameBase = `enquiries-${stamp}`

    if (format === 'pdf') {
      const pdf = toPdf(enquiries)
      return new NextResponse(pdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filenameBase}.pdf"`,
        },
      })
    }

    if (format === 'xlsx' || format === 'xls') {
      const xml = toExcelXml(enquiries)
      return new NextResponse(xml, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': `attachment; filename="${filenameBase}.xls"`,
        },
      })
    }

    const csv = toCsv(enquiries)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filenameBase}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting enquiries:', error)
    return NextResponse.json({ error: 'Failed to export enquiries' }, { status: 500 })
  }
}
