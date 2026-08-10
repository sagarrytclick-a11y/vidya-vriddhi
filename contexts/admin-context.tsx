'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
import type { AdminRole } from '@/lib/admin-roles'

interface AdminUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: AdminRole
  canDelete: boolean
  canViewLeads: boolean
}

interface AdminContextType {
  user: AdminUser | null
  isLoading: boolean
  role: AdminRole | null
  canDelete: boolean
  canViewLeads: boolean
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  loginUser: (user: AdminUser) => void
  logoutUser: () => void
  refreshSession: () => Promise<void>
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/admin-auth/verify', { credentials: 'include' })
      if (!response.ok) {
        setUser(null)
        return
      }
      const data = await response.json()
      setUser({
        id: data.username,
        name: data.username,
        email: `${data.username}@admin`,
        role: data.role,
        canDelete: Boolean(data.canDelete),
        canViewLeads: Boolean(data.canViewLeads),
      })
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const loginUser = (userData: AdminUser) => {
    setUser(userData)
  }

  const logoutUser = () => {
    setUser(null)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const value: AdminContextType = {
    user,
    isLoading,
    role: user?.role ?? null,
    canDelete: user?.canDelete ?? false,
    canViewLeads: user?.canViewLeads ?? false,
    sidebarOpen,
    setSidebarOpen,
    loginUser,
    logoutUser,
    refreshSession,
    theme,
    toggleTheme,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdminContext() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider')
  }
  return context
}

/** Convenience: whether current staff may delete CMS records */
export function useCanDelete() {
  const { canDelete, isLoading } = useAdminContext()
  return { canDelete, isLoading }
}

/** Enquiries / career applications */
export function useCanViewLeads() {
  const { canViewLeads, isLoading } = useAdminContext()
  return { canViewLeads, isLoading }
}
