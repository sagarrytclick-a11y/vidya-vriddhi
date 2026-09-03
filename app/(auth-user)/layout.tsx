import { ClerkProvider } from '@clerk/nextjs'
import { clerkAuthAppearance } from '@/lib/clerk-appearance'

export default function AuthUserLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAuthAppearance}>
      {children}
    </ClerkProvider>
  )
}
