'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }

      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // The native share sheet can be dismissed without needing an error state.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? 'Article link copied' : 'Share this article'}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"
    >
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
      {copied ? 'Link copied' : 'Share article'}
    </button>
  )
}
