import type { Database } from '@/database'

export default (db: Database) => ({
  createTemplate: async (templateText: string) =>
    db
      .insertInto('templates')
      .values({
        text: templateText,
        createdAt: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirst(),

  getByID: async (templateID: number) =>
    db
      .selectFrom('templates')
      .selectAll()
      .where('id', '=', templateID)
      .executeTakeFirst(),

  updateTemplate: async (templateID: number, templateText: string) =>
    db
      .updateTable('templates')
      .set({
        text: templateText,
        updatedAt: new Date().toISOString(),
      })
      .where('id', '=', templateID)
      .returningAll()
      .executeTakeFirst(),

  deleteTemplate: async (templateID: number) =>
    db.deleteFrom('templates').where('id', '=', templateID).execute(),
})
