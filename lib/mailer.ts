import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

export function getMailer() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const password = process.env.SMTP_PASSWORD?.replace(/\s/g, '')

  if (!host || !user || !password) return null

  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 587
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass: password },
    })
  }

  return transporter
}

export function getMailFrom() {
  return process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@vidyavriddhi.com'
}

export function getMailCc() {
  const recipients = process.env.SMTP_CC_EMAILS
    ?.split(',')
    .map((email) => email.trim())
    .filter(Boolean)

  return recipients?.length ? recipients : undefined
}

export function getAdminRecipients() {
  const recipients = process.env.ADMIN_EMAIL
    ?.split(',')
    .map((email) => email.trim())
    .filter(Boolean)

  return recipients?.length ? recipients : ['admin@vidyavriddhi.com']
}