'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function PageLoadingBar() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    let interval: NodeJS.Timeout

    // Start loading when pathname or search params change
    const handleRouteChange = () => {
      setIsLoading(true)
      setProgress(0)
      
      // Keep running progress until page is fully loaded
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 100
          }
          // Dynamic progress based on current progress
          const increment = prev < 20 ? 20 : prev < 50 ? 15 : prev < 80 ? 10 : prev < 95 ? 5 : 1
          return Math.min(prev + increment, 100)
        })
      }, 120)

      // Stop loading when page is fully loaded
      const stopLoading = () => {
        setProgress(100)
        setTimeout(() => {
          setIsLoading(false)
          setProgress(0)
        }, 300)
        if (interval) clearInterval(interval)
      }

      // Check if page is already loaded
      if (document.readyState === 'complete') {
        // If already complete, run for at least 1 second then stop
        setTimeout(stopLoading, 1000)
      } else {
        // Wait for page to load
        window.addEventListener('load', stopLoading, { once: true })
        // Fallback timeout (max 3 seconds)
        setTimeout(stopLoading, 3000)
      }

      return () => {
        if (interval) clearInterval(interval)
        window.removeEventListener('load', stopLoading)
      }
    }

    handleRouteChange()
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-slate-100">
      <div 
        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-150 ease-out shadow-lg shadow-orange-500/50"
        style={{ width: `${progress}%` }}
      >
        <div className="h-full bg-white/20 animate-pulse" />
      </div>
    </div>
  )
}
