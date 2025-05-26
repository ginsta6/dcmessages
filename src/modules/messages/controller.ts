import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'

export default (db: Database) => {
  const messages = buildRespository(db)
  const router = Router()

  router.post(
    '/',
    jsonRoute(async (req, res) => {
      const { userID, sprintID } = req.body

      try {
        const message = await messages.createMessage(userID, sprintID)

        res.status(200)
        res.json({
          message: message?.messageText,
          gifURL: message?.gifUrl,
        })
      } catch (error) {
        console.log('Error creating message:', error) // Log for debugging
        res.status(500).json({ error: 'Failed to create message' }) // Better status & message
      }
    })
  )

  return router
}
