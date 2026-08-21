'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
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
        className="relative z-[210] w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 id="service-enquiry-title" className="pr-8 text-xl font-bold text-gray-900">
          Get a free consultation
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us about your consultancy — we&apos;ll reply on email or call.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="service-name" className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="service-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="service-email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="service-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="service-phone" className="mb-1 block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <input
              id="service-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder="10-digit mobile number"
            />
          </div>
          <div>
            <label htmlFor="service-message" className="mb-1 block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="service-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder="Website, leads, social media — what do you need?"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F27121] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E05A1B] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send enquiry'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
