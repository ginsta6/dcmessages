import type { Database } from '@/database'

export default (db: Database) => ({
  createSprint: async (id: string, title: string) =>
    db
      .insertInto('sprints')
      .values({
        id,
        title,
        createdAt: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirst(),

  getByID: async (id: string) =>
    db
      .selectFrom('sprints')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst(),

  updateSprint: async (id: string, title: string) =>
    db
      .updateTable('sprints')
      .set({
        title,
        updatedAt: new Date().toISOString(),
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst(),

  deleteSprint: async (id: string) =>
    db.deleteFrom('sprints').where('id', '=', id).execute(),
})
