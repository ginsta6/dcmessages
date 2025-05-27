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
      const { username, sprintID } = req.body

      if (!username || !sprintID) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      try {
        const message = await messages.createMessage(username, sprintID)

        res.status(200)
        res.json({
          message: message?.messageText,
          gifURL: message?.gifUrl,
          sprintTitle: message?.sprintTitle,
        })
      } catch (error) {
        console.log('Error creating message:', error) // Log for debugging
        res.status(500).json({ error: 'Failed to create message' }) // Better status & message
      }
    })
  )

  router.get(
    '/',
    jsonRoute(async (req, res) => {
      const { id, page, username, sprint } = req.query
      try {
        if (typeof username === 'string') {
          const resultMessages = await messages.getByUsername(username)
          if (resultMessages.length === 0) {
            res.sendStatus(404)
          }
          res.status(200)
          res.send(resultMessages)
        }

        if (typeof sprint === 'string') {
          const resultMessages = await messages.getBySprint(sprint)
          if (resultMessages.length === 0) {
            res.sendStatus(404)
          }
          res.status(200)
          res.send(resultMessages)
        }

        // Parse pagination
        const pageNum = parseInt(page as string, 10) || 1
        const limit = 10
        const offset = (pageNum - 1) * limit

        // Parse IDs (can be a string or array of strings)
        let ids: number[] | undefined

        if (id) {
          if (Array.isArray(id)) {
            ids = id.map((v) => parseInt(v as string, 10))
          } else if (typeof id === 'string') {
            ids = id.split(',').map((v) => parseInt(v.trim(), 10))
          }
        }

        const resultMessages = await messages.findAll({ ids, limit, offset })

        res.status(200)
        res.send(resultMessages)
      } catch (error) {
        console.log('Error fetching message:', error)
        res.status(500).json({ error: 'Failed to fetch message' })
      }
    })
  )

  return router
}
