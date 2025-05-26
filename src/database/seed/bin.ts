import 'dotenv/config'
import createDatabase from '../index'
import { seedDatabase } from './seed'

const db = createDatabase(process.env.DATABASE_URL as string)

seedDatabase(db)
  .then(() => {
    console.log('Database seeded successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Failed to seed database:', error)
    process.exit(1)
  })