import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'
import { SprintBodySchema, SprintQuerySchema } from '@/validators/sprintSchema'

export default (db: Database) => {
  const sprints = buildRespository(db)
  const router = Router()

  router.post(
    '/',
    jsonRoute(async (req, res) => {
      const parseResult = SprintBodySchema.safeParse(req.body)

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid input',
          details: parseResult.error.format(),
        })
      }

      const { id, title } = parseResult.data

      try {
        const sprint = await sprints.createSprint(id, title)

        return res.status(200).json({
          createdID: sprint?.id,
          title: sprint?.title,
        })
      } catch (error) {
        console.log('Error creating sprint:', error)
        return res.status(500).json({ error: 'Failed to create sprint' })
      }
    })
  )

  router.get(
    '/',
    jsonRoute(async (req, res) => {
      const parseResult = SprintQuerySchema.safeParse(req.query)

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid query',
          details: parseResult.error.format(),
        })
      }

      const { id } = parseResult.data

      try {
        const sprint = await sprints.getByID(id)

        if (!sprint) {
          return res.status(404).json({ error: 'Sprint not found' })
        }

        return res.status(200).json(sprint)
      } catch (error) {
        console.error('Error fetching sprint:', error)
        return res.status(500).json({ error: 'Failed to get sprint' })
      }
    })
  )

  router.patch(
    '/',
    jsonRoute(async (req, res) => {
      const parseResult = SprintBodySchema.safeParse(req.body)

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid input',
          details: parseResult.error.format(),
        })
      }

      const { id, title } = parseResult.data

      try {
        const updatedSprint = await sprints.updateSprint(id, title)

        return res.status(200).json(updatedSprint)
      } catch (error) {
        console.error('Error updating sprint:', error)
        return res.status(500).json({ error: 'Failed to update sprint' })
      }
    })
  )

  router.delete(
    '/',
    jsonRoute(async (req, res) => {
      const parseResult = SprintQuerySchema.safeParse(req.query)

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid query',
          details: parseResult.error.format(),
        })
      }
      const { id } = parseResult.data

      try {
        await sprints.deleteSprint(id)

        return res.status(200).json({ success: true, deletedId: id })
      } catch (error) {
        console.error('Error deleting sprint:', error)
        return res.status(500).json({ error: 'Failed to delete sprint' })
      }
    })
  )

  return router
}
