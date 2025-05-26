import request from 'supertest'
import createDatabase from '@/database'
import createApp from '@/app'

const db = createDatabase(process.env.DATABASE_URL as string, {
  readonly: false,
})

const app = createApp(db)

// This creates a new message in the databse every time the test is run
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

  it.todo('should return 400 if userID is not provided')
  it.todo('should return 400 if sprintID is not provided')
  it.todo('should return 500 if no template is found')
})
