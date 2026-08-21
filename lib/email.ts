import { Resend } from 'resend'
import { escapeHtml, escapeHtmlAttr } from '@/lib/html-escape'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

export async function sendEnquiryEmail(data: {
  name: string
  email: string
  phone?: string
  city?: string
  category?: string
}) {
  try {
    const resend = getResend()
    if (!resend) {
      console.warn('RESEND_API_KEY is not set; skipping enquiry email')
      return { success: false, error: 'Email is not configured' }
    }

    const name = escapeHtml(data.name)
    const email = escapeHtml(data.email)
    const phone = escapeHtml(data.phone || 'Not provided')
    const city = escapeHtml(data.city || 'Not provided')
    const category = escapeHtml(data.category || 'Not provided')
    const mailto = escapeHtmlAttr(data.email)

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@vidyavriddhi.com',
      to: [process.env.ADMIN_EMAIL || 'admin@vidyavriddhi.com'],
      subject: `New Admission Enquiry from ${data.name.replace(/[\r\n]/g, ' ').slice(0, 100)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Admission Enquiry</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #4A90E2, #357ABD);
              color: white;
              padding: 20px;
              border-radius: 10px 10px 0 0;
              margin: -30px -30px 20px -30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 120px 1fr;
              gap: 10px;
              margin-bottom: 20px;
            }
            .info-label {
              font-weight: 600;
              color: #555;
            }
            .info-value {
              color: #333;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #777;
              text-align: center;
            }
            .btn {
              display: inline-block;
              background: #4A90E2;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 New Admission Enquiry</h1>
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
              
              <div class="info-label">Category:</div>
              <div class="info-value">${category}</div>
              
              <div class="info-label">Received:</div>
              <div class="info-value">${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</div>
            </div>
            
            <div style="text-align: center;">
              <a href="mailto:${mailto}" class="btn">Reply to Student</a>
            </div>
            
            <div class="footer">
              <p>This email was sent from Vidya Vriddhi Admission Portal</p>
              <p>Please respond to the student's enquiry as soon as possible.</p>
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
    console.error('Failed to send email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendServiceEnquiryEmail(data: {
  name: string
  email: string
  phone: string
  message: string
}) {
  try {
    const resend = getResend()
    if (!resend) {
      console.warn('RESEND_API_KEY is not set; skipping service enquiry email')
      return { success: false, error: 'Email is not configured' }
    }

    const name = escapeHtml(data.name)
    const email = escapeHtml(data.email)
    const phone = escapeHtml(data.phone)
    const message = escapeHtml(data.message).replace(/\n/g, '<br>')
    const mailto = escapeHtmlAttr(data.email)
    const safeSubjectName = data.name.replace(/[\r\n]/g, ' ').slice(0, 100)

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@vidyavriddhi.com',
      to: [process.env.ADMIN_EMAIL || 'admin@vidyavriddhi.com'],
      replyTo: data.email,
      subject: `New Service Enquiry from ${safeSubjectName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Service Enquiry</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px;">
            <div style="background: linear-gradient(135deg, #F27121, #E05A1B); color: white; padding: 20px; border-radius: 10px 10px 0 0; margin: -30px -30px 20px -30px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px;">New Service Enquiry</h1>
              <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Website / Leads / Social Media</p>
            </div>
            <p style="margin-bottom: 20px;">Someone requested a callback from the Services page.</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; width: 110px; color: #555;">Name</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${mailto}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Phone</td>
                <td style="padding: 8px 0;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555; vertical-align: top;">Message</td>
                <td style="padding: 8px 0;">${message}</td>
              </tr>
            </table>
            <p style="font-size: 13px; color: #777; margin: 0;">This enquiry was emailed directly and is not saved in admin.</p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend service enquiry error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send service enquiry email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
