import request from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { Express } from 'express'
import createApp from '@/app'
import { seedDatabase } from '@/database/seed/seed'


vi.mock('@/services/discord', () => ({
  sendMessageToChannel: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/services/giphy', () => ({
  default: vi.fn().mockResolvedValue({
    id: 'abc123',
    url: 'https://giphy.com/view/abc123',
    embed_url: 'https://giphy.com/embed/abc123',
    title: 'Funny Cat GIF',
    images: {
      original: {
        url: 'https://giphy.com/images/original.gif',
      },
    },
  }),
}));

let app: Express

beforeEach(async () => {
  const db = await createTestDatabase()
  await seedDatabase(db)
  app = createApp(db)
})

describe('POST /messages', () => {
  it('should send a message and return 200', async () => {
    const response = await request(app).post('/messages').send({
      username: 'johdoe',
      sprintID: 'WD-1.1',
    })

    expect(response.status).toBe(200)
    expect(response.body.message).toBeDefined()
    expect(response.body.gifURL).toMatch(/^https?:\/\//)
    expect(response.body.sprintTitle).toBe('Python basics')
  })

  it('should return 400 if userID is not provided', async () => {
    const response = await request(app).post('/messages').send({
      sprintID: 'WD-1.1',
    })
    expect(response.status).toBe(400)
  })

  it('should return 400 if sprintID is not provided', async () => {
    const response = await request(app).post('/messages').send({
      userID: '1223',
    })
    expect(response.status).toBe(400)
  })
})

describe('GET /messages', () => {
  describe('get all messages by id or page', () => {
    it('should return a list of 10 messages if page is not provided', async () => {
      const { body } = await request(app).get('/messages').expect(200)

      expect(body).toHaveLength(10)
    })

    it('should return a list of correct 10 messages if page is provided', async () => {
      const { body } = await request(app).get('/messages?page=2').expect(200)

      expect(body).toHaveLength(3)
    })

    it('should return a message if id is provided', async () => {
      const { body } = await request(app).get('/messages?id=3').expect(200)

      expect(body).toMatchObject([
        {
          username: 'kyberiano',
          messageText: 'Great job on the sprint!',
          gifUrl: 'https://www.tenor.com/example1.gif',
          sprintTitle: 'Python basics',
        },
      ])
    })

    it('should return a list of messages if multiple ids provided', async () => {
      const { body } = await request(app).get('/messages?id=1,2,3').expect(200)

      expect(body).toMatchObject([
        {
          username: 'kyberiano',
          messageText: 'Great job on the sprint!',
          gifUrl: 'https://www.tenor.com/example1.gif',
          sprintTitle: 'Python basics',
        },
        {
          username: 'kyberiano',
          messageText: 'Great job on the sprint!',
          gifUrl: 'https://www.tenor.com/example1.gif',
          sprintTitle: 'Python basics',
        },
        {
          username: 'kyberiano',
          messageText: 'Great job on the sprint!',
          gifUrl: 'https://www.tenor.com/example1.gif',
          sprintTitle: 'Python basics',
        },
      ])
    })
  })
  describe('get all messages by username', () => {
    it('should return a list of messages for provided username', async () => {
      const { body } = await request(app)
        .get('/messages?username=johdoe')
        .expect(200)

      expect(body).toMatchObject([
        {
          username: 'johdoe',
          messageText: 'Great job on the sprint!',
          gifUrl: 'https://www.tenor.com/example1.gif',
          sprintTitle: 'Python OOP',
        },
        {
          username: 'johdoe',
          messageText: 'Great job on the sprint!',
          gifUrl: 'https://www.tenor.com/example1.gif',
          sprintTitle: 'Python basics',
        },
      ])
    })

    it('should return 404 if no messages for username exist', async () => {
      await request(app).get('/messages?username=notreal').expect(404)
    })
  })
  describe('get all messages by sprint id', () => {
    it('should return a list of messages for provided sprint id', async () => {
      const { body } = await request(app)
        .get('/messages?sprint=WD-1.2')
        .expect(200)

      expect(body).toMatchObject([
        {
          username: 'johdoe',
          messageText: 'Great job on the sprint!',
          gifUrl: 'https://www.tenor.com/example1.gif',
          sprintTitle: 'Python OOP',
        },
        {
          username: 'kyberiano',
          messageText: 'Great job on the sprint!',
          gifUrl: 'https://www.tenor.com/example1.gif',
          sprintTitle: 'Python OOP',
        },
      ])
    })

    it('should return 404 if no messages for sprint exist', async () => {
      await request(app).get('/messages?sprint=OS-1.1').expect(404)
    })
  })
})
