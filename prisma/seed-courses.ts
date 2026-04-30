import 'dotenv/config'

import { db } from '@/lib/db'

async function main() {
  // Add courses
  const courses = [
    { name: 'MBA', slug: 'mba', description: 'Master of Business Administration', active: true },
    { name: 'MBBS', slug: 'mbbs', description: 'Bachelor of Medicine, Bachelor of Surgery', active: true },
    { name: 'B.Tech', slug: 'b-tech', description: 'Bachelor of Technology', active: true },
    { name: 'B.Com', slug: 'b-com', description: 'Bachelor of Commerce', active: true },
    { name: 'BA', slug: 'ba', description: 'Bachelor of Arts', active: true },
    { name: 'B.Sc', slug: 'b-sc', description: 'Bachelor of Science', active: true },
    { name: 'BCA', slug: 'bca', description: 'Bachelor of Computer Applications', active: true },
    { name: 'Law', slug: 'law-course', description: 'Law Degree (LLB, BA LLB)', active: true },
  ]

  for (const course of courses) {
    await db.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    })
  }

  console.log('Courses seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
