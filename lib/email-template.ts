import { escapeHtml, escapeHtmlAttr } from '@/lib/html-escape'

type NotificationEmailOptions = {
  category: string
  title: string
  introduction: string
  details: Array<{ label: string; value: string }>
  replyTo: string
  footer: string
}

export function renderNotificationEmail({
  category,
  title,
  introduction,
  details,
  replyTo,
  footer,
}: NotificationEmailOptions) {
  const rows = details
    .map(({ label, value }) => `
      <tr>
        <td style="width: 32%; padding: 13px 12px 13px 0; border-bottom: 1px solid #e7ece9; color: #65736e; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top;">
          ${escapeHtml(label)}
        </td>
        <td style="padding: 13px 0; border-bottom: 1px solid #e7ece9; color: #20332d; font-size: 14px; line-height: 1.55; overflow-wrap: anywhere;">
          ${escapeHtml(value).replace(/\r?\n/g, '<br>')}
        </td>
      </tr>
    `)
    .join('')

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="light">
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #edf2ef; color: #20332d; font-family: Arial, Helvetica, sans-serif;">
        <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">
          ${escapeHtml(introduction)}
        </div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background-color: #edf2ef;">
          <tr>
            <td align="center" style="padding: 28px 12px;">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 600px; border-collapse: separate; border-spacing: 0;">
                <tr>
                  <td style="padding: 24px 28px 26px; background-color: #173c35; border-radius: 8px 8px 0 0;">
                    <p style="margin: 0 0 22px; color: #d7e6dd; font-size: 12px; font-weight: 700; letter-spacing: 1.2px;">VIDYA VRIDDHI</p>
                    <p style="margin: 0 0 8px; color: #b9d77a; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">${escapeHtml(category)}</p>
                    <h1 style="margin: 0; color: #ffffff; font-size: 25px; font-weight: 700; line-height: 1.25;">${escapeHtml(title)}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 26px 28px 28px; background-color: #ffffff;">
                    <p style="margin: 0 0 22px; color: #52615b; font-size: 14px; line-height: 1.6;">${escapeHtml(introduction)}</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-collapse: collapse;">
                      ${rows}
                    </table>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px;">
                      <tr>
                        <td align="center" bgcolor="#d8e7a5" style="border-radius: 5px;">
                          <a href="mailto:${escapeHtmlAttr(replyTo)}" style="display: inline-block; padding: 12px 18px; border: 1px solid #d8e7a5; border-radius: 5px; color: #173c35; font-size: 13px; font-weight: 700; text-decoration: none;">Reply to enquiry</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 20px; background-color: #f7f9f7; border-radius: 0 0 8px 8px; color: #77847e; font-size: 11px; line-height: 1.5; text-align: center;">
                    ${escapeHtml(footer)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}