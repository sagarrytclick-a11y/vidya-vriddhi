import type { Metadata } from 'next'
import { MBBSPage } from '../components/mbbs-page'
import { kyrgyzstanData } from '../data/kyrgyzstan'

export const metadata: Metadata = {
  title: 'Study MBBS in Kyrgyzstan 2026 | Admissions Open',
  description: 'Secure admission in NMC & WHO recognized medical universities in Kyrgyzstan with Vidya Vriddhi expert guidance, transparent counselling, and end-to-end support.',
  keywords: ['MBBS in Kyrgyzstan', 'Study MBBS Abroad', 'Medical Universities in Kyrgyzstan', 'Kyrgyzstan MBBS Fees', 'Vidya Vriddhi'],
  alternates: { canonical: '/mbbs-in-kyrgyzstan' },
  openGraph: {
    title: 'Study MBBS in Kyrgyzstan 2026',
    description: 'Secure admission in NMC & WHO recognized medical universities in Kyrgyzstan with expert guidance and transparent counselling.',
    type: 'website',
  },
}

export default function Page() {
  return <MBBSPage data={kyrgyzstanData} />
}
