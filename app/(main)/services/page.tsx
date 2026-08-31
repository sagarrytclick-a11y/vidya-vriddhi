import type { Metadata } from 'next'
import ServicesPageClient from '@/components/services/ServicesPageClient'

export const metadata: Metadata = {
  title: 'Services | Websites, Leads & Social Media for Education Consultants',
  description:
    'VidyaVriddhi builds websites, provides student leads, and manages social media for education consultants and admission agencies across India.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services for Education Consultants',
    description:
      'Website creation, lead generation, and social media management for educational consultants.',
  },
}

export default function ServicesPage() {
  return <ServicesPageClient />
}
