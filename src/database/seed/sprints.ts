import type { Database } from '@/database'

export default async function seedSprints(db: Database) {
  await db
    .insertInto('sprints')
    .values([
      {
        id: 'WD-1.1',
        title: 'Python basics',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'WD-1.2',
        title: 'Python OOP',
        createdAt: new Date().toISOString(),
      },
    ])
    .execute()
}
