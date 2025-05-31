import { Client, Events, GatewayIntentBits } from 'discord.js'
import type { TextChannel } from 'discord.js'
import type { Messages } from '@/database'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
})

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
  }
})

export function startDiscordBot(token: string) {
  client.login(token).catch((err) => {
    console.error('Failed to login Discord bot:', err)
  })
}

export async function sendMessageToChannel(rawMessageData: Messages) {
  const { DC_CHANNEL_ID, DC_GUILD_ID } = process.env
  if (!DC_CHANNEL_ID) {
    throw new Error('Provide DC_CHANNEL_ID in your environment variables.')
  }
  if (!DC_GUILD_ID) {
    throw new Error('Provide DC_GUILD_ID in your environment variables.')
  }
  try {
    const channel = await client.channels.fetch(DC_CHANNEL_ID)

    if (!channel?.isTextBased()) {
      throw new Error('Channel not found or is not text-based.')
    }

    const userid = await findMemberByUsername(
      DC_GUILD_ID,
      rawMessageData.username
    )

    if (!userid) {
      throw new Error('User is not present in the server')
    }

    await (channel as TextChannel).send(
      await formatMessage(userid, rawMessageData)
    )
    await (channel as TextChannel).send(rawMessageData.gifUrl)
    console.log(`Message sent to ${DC_CHANNEL_ID}`)
  } catch (err) {
    console.log(`Failed to send message to channel ${DC_CHANNEL_ID}:`, err)
    throw err
  }
}

async function formatMessage(userid: string, data: Messages): Promise<string> {
  const message = `<@${userid}> completed **${data.sprintTitle}**!\n\n${data.messageText}`

  return message
}

export async function findMemberByUsername(
  guildId: string,
  username: string
): Promise<string | null> {
  const guild = await client.guilds.fetch(guildId)
  if (!guild) return null

  // Fetch all members (may be paginated if large server)
  await guild.members.fetch()

  // Find by username
  const member = guild.members.cache.find((m) => m.user.username === username)

  return member?.user.id ?? null
}
