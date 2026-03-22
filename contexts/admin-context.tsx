'use client'

import React, { createContext, useContext, ReactNode, useState } from 'react'

interface AdminUser {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AdminContextType {
  user: AdminUser | null
  isLoading: boolean
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  loginUser: (user: AdminUser) => void
  logoutUser: () => void
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>({
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: '/admin-avatar.jpg'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const loginUser = (userData: AdminUser) => {
    setUser(userData)
  }

  const logoutUser = () => {
    setUser(null)
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const value: AdminContextType = {
    user,
    isLoading,
    sidebarOpen,
    setSidebarOpen,
    loginUser,
    logoutUser,
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
