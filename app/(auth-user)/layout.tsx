import { ClerkProvider } from '@clerk/nextjs'

export default function AuthUserLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>
}
