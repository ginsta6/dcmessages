import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'
import getGif from '@/services/giphy'
import { sendMessageToChannel } from '@/services/discord'
import {
  CreateMessageInputSchema,
  GetMessagesQuerySchema,
} from '@/validators/messageSchema'

export default (db: Database) => {
  const messages = buildRespository(db)
  const router = Router()

  router.post(
    '/',
    jsonRoute(async (req, res) => {
      const parseResult = CreateMessageInputSchema.safeParse(req.body)

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid input',
          details: parseResult.error.format(),
        })
      }

      const { username, sprintID } = parseResult.data

      const gifData = await getGif('congratulations')
      if (!gifData)
        return res.status(500).json({ error: 'Failed fetching gif' })

      try {
        const message = await messages.createMessage(
          username,
          sprintID,
          gifData.embed_url
        )

        sendMessageToChannel(message)
        return res.status(200).json({
          message: message?.messageText,
          gifURL: message?.gifUrl,
          sprintTitle: message?.sprintTitle,
        })
      } catch (error) {
        console.log('Error creating message:', error) // Log for debugging
        return res.status(500).json({ error: 'Failed to create message' }) // Better status & message
      }
    })
  )

  router.get(
    '/',
    jsonRoute(async (req, res) => {
      const parseResult = GetMessagesQuerySchema.safeParse(req.query)

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid query',
          details: parseResult.error.format(),
        })
      }

      const { id, page, username, sprint } = parseResult.data
      try {
        if (username) {
          const resultMessages = await messages.getByUsername(username)
          if (resultMessages.length === 0) {
            return res.sendStatus(404)
          }
          return res.status(200).send(resultMessages)
        }

        if (sprint) {
          const resultMessages = await messages.getBySprint(sprint)
          if (resultMessages.length === 0) {
            return res.sendStatus(404)
          }
          return res.status(200).send(resultMessages)
        }

        // Parse pagination
        const pageNum = parseInt(page ?? '1', 10)
        const limit = 10
        const offset = (pageNum - 1) * limit

        // Parse IDs (can be a string or array of strings)
        let ids: number[] | undefined

        if (id) {
          if (Array.isArray(id)) {
            ids = id.map((v) => parseInt(v, 10))
          } else {
            ids = id.split(',').map((v) => parseInt(v.trim(), 10))
          }
        }

        const resultMessages = await messages.findAll({ ids, limit, offset })

        return res.status(200).send(resultMessages)
      } catch (error) {
        console.log('Error fetching message:', error)
        return res.status(500).json({ error: 'Failed to fetch message' })
      }
    })
  )

  return router
}
