import type { Database } from '@/database'
import seedSprints from './sprints'
import seedTemplates from './templates'
import seedMessages from './messages'

export async function seedDatabase(db: Database) {
  // Run seeds in order (templates first since messages depend on them)
  await seedSprints(db)
  await seedTemplates(db)
  await seedMessages(db)
}
