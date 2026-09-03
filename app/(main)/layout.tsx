import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AdmissionModalProvider } from '@/contexts/admission-modal-context'
import { VVSaarthiProvider } from '@/contexts/vv-saarthi-context'
import { DeferredWidgets } from '@/components/DeferredWidgets'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <AdmissionModalProvider>
        <VVSaarthiProvider>
          <Navbar />
          {/* Fixed navbar: top bar (~4rem) + desktop secondary nav (~3rem). Keep clear of content. */}
          <div className="pt-20 lg:pt-[7.5rem]">{children}</div>
          <Footer />
          <DeferredWidgets />
        </VVSaarthiProvider>
      </AdmissionModalProvider>
    </ClerkProvider>
  )
}
