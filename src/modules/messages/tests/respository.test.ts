import createTestDatabase from '@tests/utils/createTestDatabase'
import { deleteAllFor } from '@tests/utils/records'
import { seedDatabase } from '@/database/seed/seed'
import buildRespository from '../repository'

let messages: ReturnType<typeof buildRespository>
let deleteTemplates: ReturnType<typeof deleteAllFor>

beforeEach(async () => {
  const db = await createTestDatabase()
  await seedDatabase(db)
  deleteTemplates = deleteAllFor(db, 'templates')
  messages = buildRespository(db)
})

describe('getByUsername', () => {
  it('should return messages sent to a provided username', async () => {
    const result = await messages.getByUsername('johdoe')

    expect(result).toBeDefined()
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      username: 'johdoe',
    })
  })

  it('should return an empty array if username does not exist', async () => {
    const result = await messages.getByUsername('janedoe')

    expect(result).toBeDefined()
    expect(result).toEqual([])
  })
})

describe('findAll', () => {
  it('should return a default number of messages if no ids are provided', async () => {
    const result = await messages.findAll({})
    expect(result).toBeDefined()
    expect(result.length).toBeLessThanOrEqual(10)
  })

  it('should return messages by provided ids', async () => {
    const result = await messages.findAll({ ids: [1, 2, 3] })
    expect(result).toBeDefined()
    expect(result).toHaveLength(3)
    expect(result[0]).toHaveProperty('id', 1)
  })

  it('should respect limit and offset', async () => {
    const result = await messages.findAll({ limit: 5, offset: 5 })
    expect(result).toHaveLength(5)
  })
})

describe('getBySprint', () => {
  it('should return messages for the provided sprintID', async () => {
    const result = await messages.getBySprint('WD-1.1')
    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('sprintTitle')
    expect(result[0]).toMatchObject({
      sprintTitle: 'Python basics',
    })
  })

  it('should return an empty array if no messages for the sprintID', async () => {
    const result = await messages.getBySprint('nonexistent-sprint-id')
    expect(result).toBeDefined()
    expect(result).toEqual([])
  })
})

describe('createMessage', () => {
  it('should create a message for valid username and sprintID', async () => {
    const result = await messages.createMessage(
      'johdoe',
      'WD-1.1',
      'https://tenor.com/embed.gif'
    )
    expect(result).toBeDefined()
    expect(result).toHaveProperty('username', 'johdoe')
    expect(result).toHaveProperty('gifUrl', 'https://tenor.com/embed.gif')
  })

  it('should throw an error if no template exists', async () => {
    await deleteTemplates() // deletes all

    await expect(
      messages.createMessage('johdoe', 'WD-1.1', 'https://tenor.com/embed.gif')
    ).rejects.toThrow('No template found')
  })

  it('should throw an error if no sprint exists', async () => {
    await expect(
      messages.createMessage(
        'johdoe',
        'nonexistent-sprint',
        'https://tenor.com/embed.gif'
      )
    ).rejects.toThrow('No sprint found')
  })
})
