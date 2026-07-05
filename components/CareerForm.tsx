'use client'

import { useState, useRef } from 'react'
import { Send, Upload, Loader2, CheckCircle2, FileText } from 'lucide-react'

const POSITIONS = [
  'Full-Stack Developer',
  'Sales Executive',
  'Social Media Executive',
  'Education Counselor',
  'Graphic Designer',
  'Other',
]

export function CareerForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const positions = POSITIONS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resume) { setErrorMsg('Please upload your resume (PDF)'); return }
    if (resume.type !== 'application/pdf') { setErrorMsg('Only PDF files are accepted'); return }
    if (resume.size > 10 * 1024 * 1024) { setErrorMsg('File size must be under 10MB'); return }

    setStatus('loading')
    setErrorMsg('')

    const fd = new FormData()
    fd.append('name', name)
    fd.append('email', email)
    fd.append('phone', phone)
    fd.append('position', position)
    fd.append('resume', resume)

    try {
      const res = await fetch('/api/career', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.error || 'Something went wrong'); setStatus('error'); return }
      setStatus('success')
      setName(''); setEmail(''); setPhone(''); setPosition(''); setResume(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-xl font-bold text-green-800">Application Submitted!</h3>
        <p className="mt-2 text-green-700">We&apos;ll review your resume and get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
        <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
        <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Position Applying For *</label>
        <select required value={position} onChange={e => setPosition(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all">
          <option value="">Select a position</option>
          {positions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume (PDF) *</label>
        <div className="relative">
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={e => setResume(e.target.files?.[0] || null)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-orange-600 hover:file:bg-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
          {resume && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
              <FileText className="h-4 w-4" />
              <span className="truncate max-w-[250px]">{resume.name}</span>
              <span className="text-slate-400">({(resume.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>
      </div>
      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
      <button type="submit" disabled={status === 'loading'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-all">
        {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status === 'loading' ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}
