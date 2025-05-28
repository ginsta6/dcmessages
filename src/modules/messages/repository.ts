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

  const getSprintTitle = async (sprintID: string) =>
    db
      .selectFrom('sprints')
      .selectAll()
      .where('id', '=', sprintID)
      .limit(1)
      .executeTakeFirst()

  return {
    findAll: async ({
      ids,
      limit = 10,
      offset = 0,
    }: {
      ids?: number[]
      limit?: number
      offset?: number
    }) => {
      if (ids) {
        return db
          .selectFrom('messages')
          .selectAll()
          .where('id', 'in', ids)
          .execute()
      }
      return db
        .selectFrom('messages')
        .selectAll()
        .limit(limit)
        .offset(offset)
        .execute()
    },

    getByUsername: async (username: string) =>
      db
        .selectFrom('messages')
        .selectAll()
        .where('username', '=', username)
        .execute(),

    getBySprint: async (sprintID: string) =>
      db
        .selectFrom('messages')
        .innerJoin('sprints', 'messages.sprintTitle', 'sprints.title')
        .select([
          'messages.id',
          'messages.username',
          'messages.messageText',
          'messages.gifUrl',
          'messages.sprintTitle',
          'messages.sentAt',
          'messages.status',
        ])
        .where('sprints.id', '=', sprintID)
        .execute(),

    createMessage: async (username: string, sprintID: string, gifUrl: string) => {
      const template = await getRandomTemplate()
      const sprint = await getSprintTitle(sprintID)

      if (!template) {
        throw new Error('No template found')
      }

      if (!sprint) {
        throw new Error('No sprint found')
      }

      return db
        .insertInto('messages')
        .values({
          username,
          messageText: template.text,
          gifUrl,
          sprintTitle: sprint.title,
          sentAt: new Date().toISOString(),
          status: 'sent',
        })
        .returningAll()
        .executeTakeFirst()
    },
  }
}
