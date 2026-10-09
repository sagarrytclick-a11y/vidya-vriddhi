'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Mail, MessageSquareText, Phone, Send, UserRound, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ServiceEnquiryModalProps {
  open: boolean
  onClose: () => void
}

export function ServiceEnquiryModal({ open, onClose }: ServiceEnquiryModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const reset = () => {
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/service-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send enquiry')
      }
      toast.success(data.message || 'Enquiry sent successfully')
      reset()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send enquiry')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-enquiry-title"
        aria-describedby="service-enquiry-description"
        className="relative z-[210] max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_-20px_rgba(11,31,58,0.35)]"
      >
        <div className="relative border-b border-slate-200 bg-[#f8fafb] px-5 pb-5 pt-6 sm:px-8 sm:pb-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close consultation form"
            title="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-[#0b1f3a]"
          >
            <X className="h-4 w-4" />
          </button>

          <Image
            src="/logo.png"
            alt="Vidya Vriddhi"
            width={180}
            height={56}
            priority
            className="mb-5 h-10 w-auto object-contain object-left sm:h-11"
          />
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#F27121]">
            Education growth services
          </p>
          <h2 id="service-enquiry-title" className="pr-8 text-2xl font-bold leading-tight text-[#0b1f3a]">
            Let&apos;s grow your consultancy
          </h2>
          <p id="service-enquiry-description" className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            Share what you&apos;re looking for. Our team will get back to you about the right next step.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-8 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="service-name" className="mb-1.5 block text-sm font-semibold text-[#263746]">
                Your name <span className="text-[#F27121]">*</span>
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="service-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-[#263746] outline-none transition-colors placeholder:text-slate-400 focus:border-[#F27121] focus:ring-2 focus:ring-[#F27121]/15"
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="service-phone" className="mb-1.5 block text-sm font-semibold text-[#263746]">
                Phone number <span className="text-[#F27121]">*</span>
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="service-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-[#263746] outline-none transition-colors placeholder:text-slate-400 focus:border-[#F27121] focus:ring-2 focus:ring-[#F27121]/15"
                  placeholder="Your contact number"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="service-email" className="mb-1.5 block text-sm font-semibold text-[#263746]">
              Work email <span className="text-[#F27121]">*</span>
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="service-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-[#263746] outline-none transition-colors placeholder:text-slate-400 focus:border-[#F27121] focus:ring-2 focus:ring-[#F27121]/15"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="service-message" className="mb-1.5 block text-sm font-semibold text-[#263746]">
              What do you need help with? <span className="text-[#F27121]">*</span>
            </label>
            <div className="relative">
              <MessageSquareText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <textarea
                id="service-message"
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-y rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm leading-relaxed text-[#263746] outline-none transition-colors placeholder:text-slate-400 focus:border-[#F27121] focus:ring-2 focus:ring-[#F27121]/15"
                placeholder="Website, student leads, social media..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0b1f3a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#132a4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27121] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending enquiry...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send enquiry
              </>
            )}
          </button>
          <p className="text-center text-xs leading-relaxed text-slate-500">
            Your details will only be used to respond to this enquiry.
          </p>
        </form>
      </div>
    </div>
  )
}
