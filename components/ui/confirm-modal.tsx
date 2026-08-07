'use client'

import React from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from './button'
import {
  adminDialogClass,
  adminCancelBtnClass,
  adminDangerBtnClass,
} from '@/components/admin/modal-ui'
import { cn } from '@/lib/utils'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'delete' | 'warning' | 'danger'
  isLoading?: boolean
  /** Optional detail lines shown in the dark info box */
  details?: Array<{ label: string; value: string }>
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'delete',
  isLoading = false,
  details,
}: ConfirmModalProps) {
  const isDelete = type === 'delete'
  const titleColor =
    type === 'warning' ? 'text-amber-400' : type === 'danger' ? 'text-orange-400' : 'text-rose-400'
  const warnBox =
    type === 'warning'
      ? 'border-amber-500/20 bg-amber-500/10'
      : type === 'danger'
        ? 'border-orange-500/20 bg-orange-500/10'
        : 'border-rose-500/20 bg-rose-500/10'
  const warnText =
    type === 'warning'
      ? 'text-amber-300'
      : type === 'danger'
        ? 'text-orange-300'
        : 'text-rose-300'
  const confirmClass =
    type === 'warning'
      ? 'rounded-xl bg-amber-600 text-white hover:bg-amber-500 font-semibold'
      : type === 'danger'
        ? 'rounded-xl bg-orange-600 text-white hover:bg-orange-500 font-semibold'
        : adminDangerBtnClass

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className={cn(adminDialogClass, 'max-w-md')}>
        <DialogHeader>
          <DialogTitle className={cn('flex items-center gap-2', titleColor)}>
            {isDelete ? <Trash2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className={cn('rounded-xl border p-4', warnBox)}>
            <p className={cn('text-sm', warnText)}>{message}</p>
            {isDelete && (
              <p className="mt-2 text-xs text-rose-400/80">
                This action cannot be undone. The record will be permanently removed.
              </p>
            )}
          </div>

          {details && details.length > 0 && (
            <div className="rounded-xl border border-white/6 bg-[#0c0f14] p-3 space-y-1">
              {details.map((row) => (
                <p key={row.label} className="text-sm text-[#9ca3af]">
                  <strong className="text-white">{row.label}:</strong> {row.value}
                </p>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className={adminCancelBtnClass}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={confirmClass}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </span>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
