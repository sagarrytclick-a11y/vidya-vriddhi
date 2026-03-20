import { CountryProvider } from '@/contexts/country-context'

export default function CountriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CountryProvider>{children}</CountryProvider>
}
