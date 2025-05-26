import { sql } from 'kysely'
import type { Database } from '@/database'

export default (db: Database) => {
  const getRandomTemplate = async () =>
    db
      .selectFrom('templates')
      .selectAll()
      .orderBy(sql`RANDOM()`)
      .limit(1)
      .executeTakeFirst()

  return {
    findAll: async (limit = 10, offset = 0) => {
      db.selectFrom('messages')
        .selectAll()
        .limit(limit)
        .offset(offset)
        .execute()
    },

    createMessage: async (userID: string, sprintID: string) => {
      const template = await getRandomTemplate()

      if (!template) {
        throw new Error('No template found')
      }

      return db
        .insertInto('messages')
        .values({
          userId: parseInt(userID, 10),
          messageText: template.text,
          gifUrl: 'https://www.tenor.com',
          strintId: sprintID,
          sentAt: new Date().toISOString(),
          status: 'sent',
        })
        .returningAll()
        .executeTakeFirst()
    },

    getRandomTemplate,
  }
}

// userID: '123',
// sprintID: 'WD-1.1',
