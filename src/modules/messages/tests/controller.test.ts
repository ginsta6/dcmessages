import request from 'supertest'
import createDatabase from '@/database'
import createApp from '@/app'

const db = createDatabase(process.env.DATABASE_URL as string, {
  readonly: true,
})

const app = createApp(db)

describe('POST /messages', () => {
  it('should send a message and return 200', async () => {
    const response = await request(app).post('/messages').send({
      userID: '123',
      sprintID: 'WD-1.1',
    })

    expect(response.status).toBe(200)
    expect(response.body.message).toBeDefined()
    expect(response.body.gifURL).toMatch(/^https?:\/\//)
  })
})
