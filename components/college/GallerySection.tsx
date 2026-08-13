'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, ImageIcon, Expand } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface GallerySectionProps {
  images: string[]
}

function isValidImageUrl(img: unknown): img is string {
  if (typeof img !== 'string') return false
  const s = img.trim()
  return s.startsWith('data:') || s.startsWith('http://') || s.startsWith('https://')
}

export function GallerySection({ images }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const validImages = images.filter(isValidImageUrl)

  if (validImages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <ImageIcon className="mx-auto mb-3 h-10 w-10 text-gray-400" />
        <p className="text-sm text-gray-500">Gallery images coming soon</p>
      </div>
    )
  }

  const openAt = (index: number) => {
    setCurrentIndex(index)
    setIsDialogOpen(true)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
        <span className="text-sm text-gray-500">
          {validImages.length} photo{validImages.length === 1 ? '' : 's'}
        </span>
      </div>

      <div
        className={cn(
          'grid gap-3',
          validImages.length === 1
            ? 'grid-cols-1'
            : validImages.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {validImages.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => openAt(idx)}
            className={cn(
              'group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-sm',
              validImages.length === 1 && 'aspect-[16/9]'
            )}
          >
            <Image
              src={img}
              alt={`Gallery image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11px] font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              <Expand className="h-3 w-3" />
              View
            </span>
          </button>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          overlayClassName="z-[10000]"
          className="z-[10001] max-w-5xl border-none bg-black/95 p-0"
        >
          <DialogTitle className="sr-only">Image Gallery</DialogTitle>
          <div className="relative z-[10002] aspect-video">
            <Image
              src={validImages[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />

            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 z-[10003] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 z-[10003] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 left-1/2 z-[10003] -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 text-xs text-white">
              {currentIndex + 1} / {validImages.length}
            </div>
          </div>

          <div className="relative z-[10002] flex gap-2 overflow-x-auto bg-black p-4">
            {validImages.map((img, idx) => (
              <button
                key={`dialog-${img}-${idx}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  'relative h-14 w-14 shrink-0 overflow-hidden rounded border-2 transition-colors',
                  idx === currentIndex ? 'border-orange-500' : 'border-transparent'
                )}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
