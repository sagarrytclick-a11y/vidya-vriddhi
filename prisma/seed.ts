import 'dotenv/config'

import { db } from '@/lib/db'

async function main() {

  const categories = [
    {
      name: 'Engineering',
      slug: 'engineering',
      description: 'Engineering colleges and courses',
      active: true,
    },
    {
      name: 'Medical',
      slug: 'medical',
      description: 'Medical colleges and healthcare courses',
      active: true,
    },
    {
      name: 'Management',
      slug: 'management',
      description: 'MBA and management courses',
      active: true,
    },
    {
      name: 'Law',
      slug: 'law',
      description: 'Law colleges and legal courses',
      active: true,
    },
    {
      name: 'Arts',
      slug: 'arts',
      description: 'Arts and humanities courses',
      active: true,
    },
    {
      name: 'Science',
      slug: 'science',
      description: 'Science colleges and courses',
      active: true,
    },
    {
      name: 'Commerce',
      slug: 'commerce',
      description: 'Commerce and accounting courses',
      active: true,
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'Design and creative courses',
      active: true,
    },
  ]

  for (const category of categories) {
    await db.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }



  const countries = [
    {
      name: 'United States',
      slug: 'united-states',
      flagEmoji: '🇺🇸',
      description: 'United States of America',
      active: true,
    },
    {
      name: 'United Kingdom',
      slug: 'united-kingdom',
      flagEmoji: '🇬🇧',
      description: 'United Kingdom',
      active: true,
    },
    {
      name: 'India',
      slug: 'india',
      flagEmoji: '🇮🇳',
      description: 'India',
      active: true,
    },
  ]

  for (const country of countries) {
    await db.country.upsert({
      where: { slug: country.slug },
      update: {},
      create: country,
    })
  }



  const usCountry = await db.country.findUnique({ where: { slug: 'united-states' } })
  const ukCountry = await db.country.findUnique({ where: { slug: 'united-kingdom' } })
  const indiaCountry = await db.country.findUnique({ where: { slug: 'india' } })

  const cities = [
    {
      name: 'New York',
      slug: 'new-york',
      description: 'The Big Apple - a global hub for finance, culture, and education. Home to world-renowned universities like Columbia and NYU.',
      cityImageURL: null,
      features: ['World-class Universities', 'Diverse Culture', 'Career Opportunities', 'Public Transit'],
      active: true,
      countryId: usCountry!.id,
    },
    {
      name: 'Boston',
      slug: 'boston',
      description: 'The Athens of America - known for its prestigious universities including Harvard and MIT.',
      cityImageURL: null,
      features: ['Top Universities', 'Historic Sites', 'Innovation Hub', 'Research Centers'],
      active: true,
      countryId: usCountry!.id,
    },
    {
      name: 'London',
      slug: 'london',
      description: 'A global city with world-class institutions like Imperial College, UCL, and LSE.',
      cityImageURL: null,
      features: ['Global Business Hub', 'Cultural Diversity', 'Top Universities', 'Historic Heritage'],
      active: true,
      countryId: ukCountry!.id,
    },
    {
      name: 'Mumbai',
      slug: 'mumbai',
      description: 'The financial capital of India with premier institutions like IIT Bombay and University of Mumbai.',
      cityImageURL: null,
      features: ['Financial Hub', 'Entertainment Industry', 'Top Engineering Colleges', 'Coastal City'],
      active: true,
      countryId: indiaCountry!.id,
    },
    {
      name: 'Delhi',
      slug: 'delhi',
      description: 'The capital city with prestigious institutions like IIT Delhi, Delhi University, and AIIMS.',
      cityImageURL: null,
      features: ['Political Capital', 'Historic Monuments', 'Top Institutions', 'Cultural Diversity'],
      active: true,
      countryId: indiaCountry!.id,
    },
    {
      name: 'Bangalore',
      slug: 'bangalore',
      description: 'The Silicon Valley of India with IISc, IIM Bangalore, and numerous tech companies.',
      cityImageURL: null,
      features: ['Tech Hub', 'Startup Ecosystem', 'Pleasant Weather', 'Research Institutions'],
      active: true,
      countryId: indiaCountry!.id,
    },
  ]

  for (const city of cities) {
    await db.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
