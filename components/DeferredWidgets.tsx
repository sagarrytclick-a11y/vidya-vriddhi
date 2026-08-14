'use client'

import dynamic from 'next/dynamic'

const FloatingActions = dynamic(() => import('@/components/FloatingActions'), { ssr: false })
const MarqueeStrip = dynamic(() => import('@/components/MarqueeStrip'), { ssr: false })
const AdmissionModal = dynamic(() =>
  import('@/components/AdmissionModal').then((m) => m.AdmissionModal)
)
const VVSaarthiSidebar = dynamic(() =>
  import('@/components/VVSaarthiSidebar').then((m) => m.VVSaarthiSidebar),
  { ssr: false }
)
const VVSaarthiFloatingButton = dynamic(() =>
  import('@/components/VVSaarthiFloatingButton').then((m) => m.VVSaarthiFloatingButton),
  { ssr: false }
)

export function DeferredWidgets() {
  return (
    <>
      <FloatingActions />
      <MarqueeStrip />
      <AdmissionModal />
      <VVSaarthiSidebar />
      <VVSaarthiFloatingButton />
    </>
  )
}
