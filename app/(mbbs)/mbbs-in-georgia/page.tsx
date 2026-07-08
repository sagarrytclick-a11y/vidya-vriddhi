import type { Metadata } from 'next'
import { MBBSPage } from '../components/mbbs-page'
import { georgiaData } from '../data/georgia'

export const metadata: Metadata = {
  title: 'Study MBBS in Georgia 2026 - Admissions Open | Vidya Vriddhi',
  description: 'Secure admission in NMC & WHO recognized medical universities in Georgia with Vidya Vriddhi expert guidance, transparent counselling, and end-to-end support.',
  keywords: ['MBBS in Georgia', 'Study MBBS Abroad', 'Medical Universities in Georgia', 'Georgia MBBS Fees', 'Vidya Vriddhi'],
  openGraph: {
    title: 'Study MBBS in Georgia 2026 - Vidya Vriddhi',
    description: 'Secure admission in NMC & WHO recognized medical universities in Georgia with expert guidance and transparent counselling.',
    type: 'website',
  },
}

export default function Page() {
  return <MBBSPage data={georgiaData} />
}
