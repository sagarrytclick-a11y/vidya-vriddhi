'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, Shield, User } from 'lucide-react'
import Image from 'next/image'
import { safeAdminRedirectPath } from '@/lib/admin-redirect'

function AdminLoginContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = safeAdminRedirectPath(searchParams.get('redirect'))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push(redirectTo)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080a0e] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,88,12,0.08),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(249,115,22,0.06),_transparent_45%)]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#12161e] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.06]">
        <div className="flex flex-col items-center px-8 pt-10">
          <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
            <Image src="/logo.png" alt="logo" height={56} width={56} className="object-contain" />
          </div>
          <p className="text-lg font-semibold tracking-tight text-[#ea580c]">Vidya Vriddhi</p>
          <p className="mt-1 text-sm text-[#6b7280]">Admin Console Sign In</p>
        </div>

        <div className="p-8 pt-6">
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-[#9ca3af]">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-[#6b7280]" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="block w-full rounded-xl border border-white/[0.06] bg-[#0c0f14] py-3 pl-10 pr-3 text-white placeholder-[#4b5563] transition focus:border-[#ea580c]/40 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 disabled:opacity-50"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#9ca3af]">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-[#6b7280]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="block w-full rounded-xl border border-white/[0.06] bg-[#0c0f14] py-3 pl-10 pr-10 text-white placeholder-[#4b5563] transition focus:border-[#ea580c]/40 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 disabled:opacity-50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6b7280] transition hover:text-[#ea580c]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center rounded-xl bg-[#ea580c] py-3.5 px-4 text-sm font-bold text-white transition hover:bg-[#c2410c] focus:outline-none focus:ring-2 focus:ring-[#ea580c]/40 focus:ring-offset-2 focus:ring-offset-[#12161e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Shield className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing In...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="mt-8 border-t border-white/[0.04] pt-6">
            <p className="text-center text-sm text-[#6b7280]">
              Secure admin access for Vidya Vriddhi
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#080a0e] px-4 py-12">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ea580c] border-t-transparent" />
            <p className="mt-4 text-[#6b7280]">Loading...</p>
          </div>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  )
}
