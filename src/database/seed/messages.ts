import type { Database } from '@/database'

export default async function seedMessages(db: Database) {
  await db
    .insertInto('messages')
    .values([
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'johdoe',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python OOP',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python OOP',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'kyberiano',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
      {
        username: 'johdoe',
        messageText: 'Great job on the sprint!',
        gifUrl: 'https://www.tenor.com/example1.gif',
        sprintTitle: 'Python basics',
        sentAt: new Date().toISOString(),
        status: 'sent',
      },
    ])
    .execute()
}
