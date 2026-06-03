'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface VVSaarthiContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const VVSaarthiContext = createContext<VVSaarthiContextType | undefined>(undefined)

export function VVSaarthiProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return (
    <VVSaarthiContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </VVSaarthiContext.Provider>
  )
}

export function useVVSaarthi() {
  const context = useContext(VVSaarthiContext)
  if (!context) {
    throw new Error('useVVSaarthi must be used within a VVSaarthiProvider')
  }
  return context
}
