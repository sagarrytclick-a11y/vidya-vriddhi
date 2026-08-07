'use client'

import { useCallback, useRef, useState } from 'react'
import { ImageIcon, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { adminCancelBtnClass, adminPrimaryBtnClass } from '@/components/admin/modal-ui'

interface AdminImageDropzoneProps {
  onFiles: (files: File[]) => void | Promise<void>
  uploading?: boolean
  multiple?: boolean
  accept?: string
  disabled?: boolean
  label?: string
  hint?: string
  className?: string
  compact?: boolean
}

/**
 * Image picker with both drag-and-drop and an explicit upload button.
 */
export function AdminImageDropzone({
  onFiles,
  uploading = false,
  multiple = false,
  accept = 'image/*',
  disabled = false,
  label = 'Upload image',
  hint = 'PNG, JPG, WEBP, GIF up to 5MB',
  className,
  compact = false,
}: AdminImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const busy = uploading || disabled

  const takeFiles = useCallback(
    async (list: FileList | File[] | null) => {
      if (!list || busy) return
      const files = Array.from(list).filter((f) => f.type.startsWith('image/'))
      if (files.length === 0) return
      await onFiles(multiple ? files : files.slice(0, 1))
      if (inputRef.current) inputRef.current.value = ''
    },
    [busy, multiple, onFiles]
  )

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!busy) setDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    void takeFiles(e.dataTransfer.files)
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'rounded-xl border-2 border-dashed bg-[#0c0f14]/50 transition-colors',
        dragging
          ? 'border-[#ea580c]/60 bg-[#ea580c]/5'
          : 'border-white/10 hover:border-white/20',
        busy && 'pointer-events-none opacity-60',
        compact ? 'p-3' : 'p-4',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={busy}
        onChange={(e) => void takeFiles(e.target.files)}
      />

      <div className={cn('flex flex-col items-center text-center', compact ? 'gap-2' : 'gap-3')}>
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-[#151a22] ring-1 ring-white/6',
            compact ? 'h-9 w-9' : 'h-12 w-12'
          )}
        >
          {uploading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ea580c] border-t-transparent" />
          ) : (
            <ImageIcon className={cn(compact ? 'h-4 w-4' : 'h-5 w-5', 'text-[#ea580c]')} />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            {uploading ? 'Uploading…' : dragging ? 'Drop image to upload' : 'Drag & drop image here'}
          </p>
          <p className="mt-1 text-xs text-[#6b7280]">{hint}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#6b7280]">
          <span className="h-px w-8 bg-white/10" />
          or
          <span className="h-px w-8 bg-white/10" />
        </div>

        <Button
          type="button"
          variant="outline"
          size={compact ? 'sm' : 'default'}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className={cn(adminPrimaryBtnClass, 'gap-2')}
        >
          <Upload className="h-4 w-4" />
          {label}
        </Button>
      </div>
    </div>
  )
}

/** Optional clear / replace row actions styled for admin forms */
export function AdminImageClearButton({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(adminCancelBtnClass, className)}
    >
      Remove
    </Button>
  )
}
