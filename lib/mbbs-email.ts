import { Resend } from 'resend'
import { escapeHtml, escapeHtmlAttr } from '@/lib/html-escape'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMBBSLeadEmail(data: {
  name: string
  email: string
  phone: string
  city: string
  state: string
  neetScore?: string
  category: string
}) {
  try {
    const name = escapeHtml(data.name)
    const email = escapeHtml(data.email)
    const phone = escapeHtml(data.phone)
    const city = escapeHtml(data.city)
    const state = escapeHtml(data.state)
    const neetScore = escapeHtml(data.neetScore || 'Not provided')
    const category = escapeHtml(data.category)
    const mailto = escapeHtmlAttr(data.email)
    const safeSubjectCategory = data.category.replace(/[\r\n]/g, ' ').slice(0, 80)
    const safeSubjectName = data.name.replace(/[\r\n]/g, ' ').slice(0, 80)

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@vidyavriddhi.com',
      to: [process.env.MBBS_LEAD_EMAIL || process.env.ADMIN_EMAIL || 'admin@vidyavriddhi.com'],
      subject: `New MBBS Lead - ${safeSubjectName} - ${safeSubjectCategory}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New MBBS Lead</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
            .container { background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #ea580c, #c2410c); color: white; padding: 24px; border-radius: 10px 10px 0 0; margin: -30px -30px 24px -30px; text-align: center; }
            .header h1 { margin: 0; font-size: 22px; }
            .header p { margin: 4px 0 0; opacity: 0.9; font-size: 14px; }
            .info-grid { display: grid; grid-template-columns: 140px 1fr; gap: 12px; margin-bottom: 20px; }
            .info-label { font-weight: 600; color: #555; }
            .info-value { color: #333; }
            .tag { display: inline-block; background: #ea580c; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New MBBS Admission Lead</h1>
              <p>${category}</p>
            </div>
            <div class="info-grid">
              <div class="info-label">Name:</div>
              <div class="info-value">${name}</div>
              <div class="info-label">Email:</div>
              <div class="info-value">${email}</div>
              <div class="info-label">Phone:</div>
              <div class="info-value">${phone}</div>
              <div class="info-label">City:</div>
              <div class="info-value">${city}</div>
              <div class="info-label">State:</div>
              <div class="info-value">${state}</div>
              <div class="info-label">NEET Score:</div>
              <div class="info-value">${neetScore}</div>
              <div class="info-label">Category:</div>
              <div class="info-value"><span class="tag">${category}</span></div>
              <div class="info-label">Received:</div>
              <div class="info-value">${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="mailto:${mailto}" style="display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Reply to Student</a>
            </div>
            <div class="footer">
              <p>Vidya Vriddhi - MBBS Admissions Portal</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send MBBS lead email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
