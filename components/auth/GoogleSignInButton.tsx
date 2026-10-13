'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

function getSafeCallbackUrl() {
  const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl')
  return callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//') ? callbackUrl : '/'
}

export function GoogleSignInButton({ label = 'Continue with Google' }: { label?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setError(null)
    setIsLoading(true)

    try {
      await signIn('google', { redirectTo: getSafeCallbackUrl() })
    } catch {
      setError('Google sign-in is temporarily unavailable. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        <FcGoogle className="h-5 w-5" aria-hidden="true" />
        {isLoading ? 'Connecting to Google…' : label}
      </button>
      {error && (
        <p className="mt-3 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
