import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'

export default (db: Database) => {
  const sprints = buildRespository(db)
  const router = Router()

  router.post(
    '/',
    jsonRoute(async (req, res) => {
      const { id, title } = req.body

      if (!id || !title) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      try {
        const sprint = await sprints.createSprint(id, title)

        res.status(200)
        res.json({
          createdID: sprint?.id,
          title: sprint?.title,
        })
      } catch (error) {
        console.log('Error creating sprint:', error) // Log for debugging
        res.status(500).json({ error: 'Failed to create sprint' }) // Better status & message
      }
    })
  )

  router.get(
    '/',
    jsonRoute(async (req, res) => {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res
          .status(400)
          .json({ error: 'Missing or invalid id parameter' })
      }

      try {
        const sprint = await sprints.getByID(id)

        if (!sprint) {
          return res.status(404).json({ error: 'Sprint not found' })
        }

        res.status(200)
        res.json(sprint)
      } catch (error) {
        console.error('Error fetching sprint:', error)
        res.status(500).json({ error: 'Failed to get sprint' })
      }
    })
  )

  router.patch(
    '/',
    jsonRoute(async (req, res) => {
      const { id, title } = req.body

      if (!id || typeof id !== 'string') {
        return res
          .status(400)
          .json({ error: 'Missing or invalid id parameter' })
      }

      try {
        const updatedSprint = await sprints.updateSprint(
          id,
          title
        )

        res.status(200)
        res.json(updatedSprint)
      } catch (error) {
        console.error('Error updating sprint:', error)
        res.status(500).json({ error: 'Failed to update sprint' })
      }
    })
  )

  router.delete(
    '/',
    jsonRoute(async (req, res) => {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res
          .status(400)
          .json({ error: 'Missing or invalid id parameter' })
      }

      try {
        await sprints.deleteSprint(id)

        res.status(200).json({ success: true, deletedId: id })
      } catch (error) {
        console.error('Error deleting sprint:', error)
        res.status(500).json({ error: 'Failed to delete sprint' })
      }
    })
  )

  return router
}
