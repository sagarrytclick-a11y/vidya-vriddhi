'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  placeholder?: string
  className?: string
}

export function SearchInput({ placeholder = 'Search colleges by name...', className = '' }: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current search value from URL (only on initial render)
  const currentSearch = searchParams.get('search') || ''

  // Local state for input value - initialized from URL
  const [inputValue, setInputValue] = useState(currentSearch)
  const [isSearching, setIsSearching] = useState(false)

  // Use ref to track debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  // Track if search was triggered by user (not URL change)
  const userTriggeredRef = useRef(false)

  // Perform search - stable callback
  const performSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const trimmedValue = value.trim()
    const currentSearchValue = params.get('search') || ''

    // Don't navigate if value hasn't changed
    if (trimmedValue === currentSearchValue) {
      setIsSearching(false)
      return
    }

    if (trimmedValue) {
      params.set('search', trimmedValue)
    } else {
      params.delete('search')
    }

    // Remove page param when searching
    params.delete('page')

    const queryString = params.toString()
    const url = queryString ? `/colleges?${queryString}` : '/colleges'

    // Use replace instead of push to avoid history spam
    router.replace(url, { scroll: false })
    setIsSearching(false)
  }, [searchParams, router])

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setIsSearching(true)
    userTriggeredRef.current = true

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(newValue)
      userTriggeredRef.current = false
    }, 400)
  }

  const handleClear = () => {
    // Clear timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    setInputValue('')
    const params = new URLSearchParams(searchParams.toString())
    const currentSearchValue = params.get('search') || ''

    // Only navigate if there was a search value
    if (currentSearchValue) {
      params.delete('search')
      params.delete('page')
      const url = params.toString() ? `/colleges?${params.toString()}` : '/colleges'
      router.replace(url, { scroll: false })
    }
  }

  // Handle Enter key press for immediate search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Clear timer and search immediately
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      performSearch(inputValue)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isSearching && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
