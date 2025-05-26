import { Kysely, SqliteDatabase } from 'kysely'

/** Migration used to initialize empty database tables for the test database. */
export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('templates')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('text', 'text', (c) => c.notNull())
    .addColumn('created_at', 'timestamp', (c) => c.notNull())
    .addColumn('updated_at', 'timestamp')
    .execute()

  await db.schema
    .createTable('sprints')
    .ifNotExists()
    .addColumn('id', 'text', (c) => c.primaryKey().notNull())
    .addColumn('title', 'text', (c) => c.notNull())
    .addColumn('created_at', 'timestamp', (c) => c.notNull())
    .addColumn('updated_at', 'timestamp')
    .execute()

  await db.schema
    .createTable('messages')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('user_id', 'integer', (c) => c.notNull())
    .addColumn('message_text', 'text', (c) => c.notNull())
    .addColumn('gif_url', 'text', (c) => c.notNull())
    .addColumn('template_id', 'integer', (c) =>
      c.notNull().references('templates.id')
    )
    .addColumn('strint_id', 'text', (c) =>
      c.notNull().references('sprints.id')
    )
    .addColumn('sent_at', 'timestamp', (c) => c.notNull())
    .addColumn('status', 'text')
    .execute()

}

export async function down() {
  // unnecessary, as this is the first migration, we can just delete the database
}
