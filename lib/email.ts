import { getAdminRecipients, getMailer, getMailCc, getMailFrom } from '@/lib/mailer'
import { renderNotificationEmail } from '@/lib/email-template'

export async function sendEnquiryEmail(data: {
  name: string
  email: string
  phone?: string
  city?: string
  category?: string
}) {
  try {
    const mailer = getMailer()
    if (!mailer) {
      console.warn('SMTP credentials are not set; skipping enquiry email')
      return { success: false, error: 'Email is not configured' }
    }

    await mailer.sendMail({
      from: getMailFrom(),
      to: getAdminRecipients(),
      cc: getMailCc(),
      subject: `New Admission Enquiry from ${data.name.replace(/[\r\n]/g, ' ').slice(0, 100)}`,
      html: renderNotificationEmail({
        category: 'Admissions',
        title: 'New admission enquiry',
        introduction: 'A student has submitted an admission enquiry. Their details are below.',
        details: [
          { label: 'Name', value: data.name },
          { label: 'Email', value: data.email },
          { label: 'Phone', value: data.phone || 'Not provided' },
          { label: 'City', value: data.city || 'Not provided' },
          { label: 'Category', value: data.category || 'Not provided' },
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
        footer: 'Sent from the Vidya Vriddhi admissions portal.',
      }),
    })

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
    const mailer = getMailer()
    if (!mailer) {
      console.warn('SMTP credentials are not set; skipping service enquiry email')
      return { success: false, error: 'Email is not configured' }
    }

    const safeSubjectName = data.name.replace(/[\r\n]/g, ' ').slice(0, 100)

    await mailer.sendMail({
      from: getMailFrom(),
      to: getAdminRecipients(),
      cc: getMailCc(),
      replyTo: data.email,
      subject: `New Service Enquiry from ${safeSubjectName}`,
      html: renderNotificationEmail({
        category: 'Website services',
        title: 'New service enquiry',
        introduction: 'Someone requested a callback about your services.',
        details: [
          { label: 'Name', value: data.name },
          { label: 'Email', value: data.email },
          { label: 'Phone', value: data.phone },
          { label: 'Message', value: data.message },
        ],
        replyTo: data.email,
        footer: 'This enquiry is also saved in Admin → Service Leads.',
      }),
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send service enquiry email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
