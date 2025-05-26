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
  it('should create new template and return 200', async () => {
    const response = await request(app).post('/templates').send({
      text: 'Good job man',
    })

    expect(response.status).toBe(200)
    expect(response.body.createdID).toBeDefined()
  })
})

describe('GET /templates', () => {
  it('should return a template with given id', async () => {
    const { body } = await request(app).get('/templates?id=1').expect(200)

    expect(body).toMatchObject({
      id: 1,
      text: 'Great job on completing the sprint! 🎉',
    })
  })
})

describe('PATCH /templates', () => {
  it('should return an updated template, given id and new text', async () => {
    const { body } = await request(app).patch('/templates').send({
      id: '1',
      text: 'Great job man',
    }).expect(200)

    expect(body).toMatchObject({
      id: 1,
      text: 'Great job man',
    })
  })
})

describe('DELETE /templates', () => {
  it('should delete template with given id', async () => {
    // Optional: Insert a template beforehand if needed

    // Delete it
    const deleteResponse = await request(app)
      .delete('/templates?id=1')
      .expect(200); // or 204, depending on your API design

    expect(deleteResponse.body).toMatchObject({
      success: true,
      deletedId: 1,
    }); // if you return something

    // Confirm it no longer exists
    const getResponse = await request(app)
      .get('/templates?id=1')

    expect(getResponse.body).toMatchObject({
      error: 'Template not found',
    })
    expect(getResponse.status).toBe(404)
  })
})
