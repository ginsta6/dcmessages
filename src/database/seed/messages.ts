import type { Database } from '@/database'

export default async function seedMessages(db: Database) {
  await db
    .insertInto('messages')
    .values([
      {
        userId: 1,
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        strintId: 'WD-1.1',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
    ])
    .execute()
}
