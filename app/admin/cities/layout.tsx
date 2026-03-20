import { CityProvider } from '@/contexts/city-context'

export default function CitiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CityProvider>{children}</CityProvider>
}
