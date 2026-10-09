import { getAdminRecipients, getMailer, getMailCc, getMailFrom } from '@/lib/mailer'
import { renderNotificationEmail } from '@/lib/email-template'

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
    const mailer = getMailer()
    if (!mailer) {
      console.warn('SMTP credentials are not set; skipping MBBS lead email')
      return { success: false, error: 'Email is not configured' }
    }

    const safeSubjectCategory = data.category.replace(/[\r\n]/g, ' ').slice(0, 80)
    const safeSubjectName = data.name.replace(/[\r\n]/g, ' ').slice(0, 80)

    await mailer.sendMail({
      from: getMailFrom(),
      to: process.env.MBBS_LEAD_EMAIL || getAdminRecipients(),
      cc: getMailCc(),
      subject: `New MBBS Lead - ${safeSubjectName} - ${safeSubjectCategory}`,
      html: renderNotificationEmail({
        category: 'MBBS admissions',
        title: 'New MBBS admission lead',
        introduction: 'A student has submitted an MBBS admission enquiry. Their details are below.',
        details: [
          { label: 'Name', value: data.name },
          { label: 'Email', value: data.email },
          { label: 'Phone', value: data.phone },
          { label: 'City', value: data.city },
          { label: 'State', value: data.state },
          { label: 'NEET score', value: data.neetScore || 'Not provided' },
          { label: 'Category', value: data.category },
          {
            label: 'Received',
            value: new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ],
        replyTo: data.email,
        footer: 'Sent from the Vidya Vriddhi MBBS admissions portal.',
      }),
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send MBBS lead email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
