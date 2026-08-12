'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface GallerySectionProps {
  images: string[]
}

export function GallerySection({ images }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter valid images.
  // In production, your ImageKit URLs are typically `https://...` (not `data:` URLs).
  const validImages = images.filter((img) => {
    if (typeof img !== 'string') return false
    const s = img.trim()
    return s.startsWith('data:') || s.startsWith('http://') || s.startsWith('https://')
  })

  if (validImages.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Gallery images coming soon</p>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
      
      {/* Main Image */}
      <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-100">
        <Image
          src={validImages[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-cover cursor-pointer"
          sizes="(max-width: 768px) 100vw, 50vw"
          onClick={() => setIsDialogOpen(true)}
        />
        
        {validImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        
        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === currentIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* View All Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsDialogOpen(true)}
      >
        View All Images
      </Button>

      {/* Fullscreen Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">Image Gallery</DialogTitle>
          <div className="relative aspect-video">
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
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnails in dialog */}
          <div className="flex gap-2 overflow-x-auto p-4 bg-black">
            {validImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                  idx === currentIndex ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
