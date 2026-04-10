import 'dotenv/config'

import { db } from '@/lib/db'

async function main() {
  console.log('Seeding categories...')

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

  console.log('Categories seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
