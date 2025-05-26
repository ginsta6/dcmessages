import request from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { Express } from 'express'
import createApp from '@/app'
import { seedDatabase } from '@/database/seed/seed'

let app: Express

beforeEach(async () => {
  const db = await createTestDatabase()
  await seedDatabase(db)
  app = createApp(db)
})

describe('POST /templates', () => {
  it('should send a message and return 200', async () => {
    const response = await request(app).post('/messages').send({
      userID: '1223',
      sprintID: 'WD-1.1',
    })

    expect(response.status).toBe(200)
    expect(response.body.message).toBeDefined()
    expect(response.body.gifURL).toMatch(/^https?:\/\//)
  })

})
