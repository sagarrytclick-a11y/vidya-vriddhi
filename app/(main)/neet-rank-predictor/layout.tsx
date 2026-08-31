import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NEET Rank Predictor 2026 | Estimate Your Rank from Score',
  description:
    'Predict your NEET rank from your expected score. Free NEET rank predictor with college guidance for medical aspirants.',
  alternates: { canonical: '/neet-rank-predictor' },
  openGraph: {
    title: 'NEET Rank Predictor 2026',
    description: 'Estimate your NEET rank from score and plan medical college admissions.',
    url: '/neet-rank-predictor',
  },
}

export default function NeetRankPredictorLayout({ children }: { children: React.ReactNode }) {
  return children
}
