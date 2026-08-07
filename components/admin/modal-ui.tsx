import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

/** Shared DialogContent shell for admin CRUD modals */
export const adminDialogClass =
  'admin-modal border-white/6 bg-[#12161e] text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] sm:rounded-2xl gap-0 overflow-hidden'

/** View / detail dialogs: fixed height, header stays put, body scrolls */
export const adminViewDialogClass =
  'admin-modal !flex max-h-[85vh] w-full !flex-col gap-0 overflow-hidden border-white/6 bg-[#12161e] p-0 text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] sm:rounded-2xl'

export const adminViewHeaderClass =
  'shrink-0 border-b border-white/4 px-6 pb-4 pt-6 pr-12 text-left'

export const adminViewBodyClass =
  'min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 scrollbar-thin'

/** Shared input / textarea / select trigger field look */
export const adminFieldClass =
  'rounded-xl border-white/6 bg-[#0c0f14] text-white placeholder:text-[#6b7280] focus-visible:ring-[#ea580c]/30 focus-visible:ring-offset-0 focus-visible:border-[#ea580c]/30'

/** Select dropdown panel */
export const adminSelectContentClass =
  'rounded-xl border-white/6 bg-[#12161e] text-white shadow-xl'

/** Secondary / cancel button */
export const adminCancelBtnClass =
  'rounded-xl border-white/8 bg-transparent text-[#9ca3af] hover:bg-[#0c0f14] hover:text-white'

/** Primary brand orange CTA */
export const adminPrimaryBtnClass =
  'rounded-xl bg-[#ea580c] text-white hover:bg-[#c2410c] font-semibold'

/** Destructive CTA */
export const adminDangerBtnClass =
  'rounded-xl bg-rose-600 text-white hover:bg-rose-500 font-semibold'

/** Label text */
export const adminLabelClass = 'text-xs font-medium uppercase tracking-wider text-[#6b7280]'

/** Visible checkbox on dark admin surfaces */
export const adminCheckboxClass =
  'h-[18px] w-[18px] rounded-[5px] border-2 border-[#6b7280] bg-[#0c0f14] data-[state=checked]:border-[#ea580c] data-[state=checked]:bg-[#ea580c] data-[state=checked]:text-white'

/** Native checkbox fallback (countries modals) */
export const adminNativeCheckboxClass =
  'h-[18px] w-[18px] shrink-0 cursor-pointer appearance-auto rounded-[5px] border-2 border-[#6b7280] bg-[#0c0f14] accent-[#ea580c]'

interface AdminModalShellProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  footer?: React.ReactNode
}

const maxWidthMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
  '2xl': 'max-w-4xl',
}

/**
 * Custom overlay shell for modals that don't use Radix Dialog
 * (countries CRUD). Visual-only wrapper — no logic changes.
 */
export function AdminModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  footer,
}: AdminModalShellProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#080a0e]/75 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          'admin-modal relative z-10 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-white/6 bg-[#12161e] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]',
          maxWidthMap[maxWidth]
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex shrink-0 items-start justify-between border-b border-white/4 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-[#6b7280]">{subtitle}</p>}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 rounded-full p-0 text-[#6b7280] hover:bg-[#0c0f14] hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 scrollbar-thin">
          {children}
        </div>
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-white/4 bg-[#0c0f14]/50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
