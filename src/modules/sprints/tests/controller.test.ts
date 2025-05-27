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

describe('POST /sprints', () => {
  it('should create new sprint and return 200', async () => {
    const { body } = await request(app)
      .post('/sprints')
      .send({
        id: 'WD-2.1',
        title: 'Web dev basics',
      })
      .expect(200)

    expect(body.createdID).toBeDefined()
  })
})

describe('GET /sprints', () => {
  it('should return a sprint with given id', async () => {
    const { body } = await request(app).get('/sprints?id=WD-1.2').expect(200)

    expect(body).toMatchObject({
      id: 'WD-1.2',
      title: 'Python OOP',
    })
  })
})

describe('PATCH /sprints', () => {
  it('should return an updated sprint, given id and new title', async () => {
    const { body } = await request(app)
      .patch('/sprints')
      .send({
        id: 'WD-1.1',
        title: 'Pascal Basics',
      })
      .expect(200)

    expect(body).toMatchObject({
      id: 'WD-1.1',
      title: 'Pascal Basics',
    })
  })
})

describe('DELETE /sprints', () => {
  it('should delete sprint with given id', async () => {
    const deleteResponse = await request(app)
      .delete('/sprints?id=WD-1.1')
      .expect(200)

    expect(deleteResponse.body).toMatchObject({
      success: true,
      deletedId: 'WD-1.1',
    })

    // Confirm it no longer exists
    const getResponse = await request(app).get('/sprints?id=WD-1.1')

    expect(getResponse.body).toMatchObject({
      error: 'Sprint not found',
    })
    expect(getResponse.status).toBe(404)
  })
})
