'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  hasNext: boolean
  hasPrev: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  hasNext,
  hasPrev
}: PaginationProps) {
  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, total)

  const getVisiblePages = () => {
    const pages: number[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisible - 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const navBtnClass =
    'h-9 rounded-lg border-white/6 bg-[#151a22] text-[#d1d5db] hover:bg-[#1e2430] hover:text-white disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className="flex flex-col gap-3 border-t border-white/[0.04] bg-[#0c0f14]/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <p className="text-sm text-[#6b7280]">
          Showing <span className="font-medium text-white">{startItem}</span> to{' '}
          <span className="font-medium text-white">{endItem}</span> of{' '}
          <span className="font-medium text-white">{total}</span> results
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6b7280]">Per page</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(parseInt(value))}
          >
            <SelectTrigger className="h-9 w-[4.5rem] rounded-lg border-white/6 bg-[#151a22] text-white focus:ring-[#ea580c]/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/6 bg-[#151a22] text-white">
              {['5', '10', '20', '50'].map((value) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="focus:bg-[#1e2430] focus:text-white"
                >
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className={cn(navBtnClass, 'gap-1 px-2.5')}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page) => {
            const active = page === currentPage
            return (
              <Button
                key={page}
                variant={active ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
                className={cn(
                  'h-9 min-w-9 rounded-lg px-0',
                  active
                    ? 'border-transparent bg-[#ea580c] text-white hover:bg-[#c2410c]'
                    : 'border-white/6 bg-[#151a22] text-[#d1d5db] hover:bg-[#1e2430] hover:text-white'
                )}
              >
                {page}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className={cn(navBtnClass, 'gap-1 px-2.5')}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
