import 'dotenv/config'
import createApp from './app'
import createDatabase from './database'
import { startDiscordBot } from './services/discord'

const { DATABASE_URL, DC_TOKEN } = process.env
const PORT = 3000

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.')
}

if (!DC_TOKEN) {
  throw new Error('Provide DC_TOKEN in your environment variables.')
}

const database = createDatabase(DATABASE_URL)
const app = createApp(database)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${PORT}`)
  startDiscordBot(DC_TOKEN)
})
