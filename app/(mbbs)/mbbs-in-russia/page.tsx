import type { Metadata } from 'next'
import { MBBSPage } from '../components/mbbs-page'
import { russiaData } from '../data/russia'

export const metadata: Metadata = {
  title: 'Study MBBS in Russia 2026 - Admissions Open | Vidya Vriddhi',
  description: 'Secure admission in NMC & WHO recognized medical universities in Russia with Vidya Vriddhi expert guidance, transparent counselling, and end-to-end support.',
  keywords: ['MBBS in Russia', 'Study MBBS Abroad', 'Medical Universities in Russia', 'Russia MBBS Fees', 'Vidya Vriddhi'],
  openGraph: {
    title: 'Study MBBS in Russia 2026 - Vidya Vriddhi',
    description: 'Secure admission in NMC & WHO recognized medical universities in Russia with expert guidance and transparent counselling.',
    type: 'website',
  },
}

export default function Page() {
  return <MBBSPage data={russiaData} />
}
