'use client'

import React from 'react'
import { Bot, Sparkles } from 'lucide-react'
import { useVVSaarthi } from '@/contexts/vv-saarthi-context'

export function VVSaarthiFloatingButton() {
  const { toggle, isOpen } = useVVSaarthi()

  if (isOpen) return null

  return (
    <button
      onClick={toggle}
      className="fixed bottom-16 sm:bottom-24 right-3 sm:right-6 z-40 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-2.5 sm:p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95 group"
      aria-label="Open VV Saarthi Chat"
    >
      <div className="relative">
        <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-orange-400" />
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-200 absolute -top-1 -right-1" />
      </div>
    </button>
  )
}
