'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AdmissionModalContextType {
  isOpen: boolean
  selectedCourse: string | null
  openModal: (course?: string) => void
  closeModal: () => void
}

const AdmissionModalContext = createContext<AdmissionModalContextType | undefined>(undefined)

export function AdmissionModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const openModal = (course?: string) => {
    if (course) {
      setSelectedCourse(course)
    }
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedCourse(null)
  }

  return (
    <AdmissionModalContext.Provider value={{ isOpen, selectedCourse, openModal, closeModal }}>
      {children}
    </AdmissionModalContext.Provider>
  )
}

export function useAdmissionModal() {
  const context = useContext(AdmissionModalContext)
  if (context === undefined) {
    throw new Error('useAdmissionModal must be used within an AdmissionModalProvider')
  }
  return context
}
