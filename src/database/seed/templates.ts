import type { Database } from '@/database'

export default async function seedTemplates(db: Database) {
  await db
    .insertInto('templates')
    .values([
      {
        text: 'Great job on completing the sprint! 🎉',
        createdAt: new Date().toISOString(),
      },
      {
        text: 'Awesome work everyone! Keep it up! 💪',
        createdAt: new Date().toISOString(),
      },
    ])
    .execute()
}
