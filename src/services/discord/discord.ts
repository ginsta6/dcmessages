import { Client, Events, GatewayIntentBits, EmbedBuilder } from 'discord.js'
import type { TextChannel } from 'discord.js'
import type { Messages } from '@/database'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
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
  const { DC_CHANNEL_ID } = process.env
  if (!DC_CHANNEL_ID) {
    throw new Error('Provide DC_CHANNEL_ID in your environment variables.')
  }
  try {
    const channel = await client.channels.fetch(DC_CHANNEL_ID)

    if (!channel?.isTextBased()) {
      throw new Error('Channel not found or is not text-based.')
    }

    const embed = await formatMessage(rawMessageData)
    await (channel as TextChannel).send({embeds: [embed]})
    console.log(`Message sent to ${DC_CHANNEL_ID}`)
  } catch (err) {
    console.error(`Failed to send message to channel ${DC_CHANNEL_ID}:`, err)
    throw err
  }
}

async function formatMessage(data: Messages): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setDescription(
      `${data.username} completed **${data.sprintTitle}**!\n\n${data.messageText}`
    )
    .setImage(data.gifUrl)
    .setColor(0x00b0f4) // Optional: nice blue color
    .setTimestamp() // Optional: adds current timestamp
}
