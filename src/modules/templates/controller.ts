import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'

export default (db: Database) => {
  const templates = buildRespository(db)
  const router = Router()

  router.post(
    '/',
    jsonRoute(async (req, res) => {
      const { text } = req.body

      if (!text) {
        return res.status(400).json({ error: 'Missing text field' })
      }

      try {
        const template = await templates.createTemplate(text)

        res.status(200)
        res.json({
          createdID: template?.id,
          text: template?.text,
        })
      } catch (error) {
        console.log('Error creating template:', error) // Log for debugging
        res.status(500).json({ error: 'Failed to create template' }) // Better status & message
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
        const template = await templates.getByID(parseInt(id, 10))

        if (!template) {
          return res.status(404).json({ error: 'Template not found' })
        }

        res.status(200)
        res.json(template)
      } catch (error) {
        console.error('Error fetching template:', error)
        res.status(500).json({ error: 'Failed to get template' })
      }
    })
  )

  router.patch(
    '/',
    jsonRoute(async (req, res) => {
      const { id, text } = req.body

      if (!id || typeof id !== 'string') {
        return res
          .status(400)
          .json({ error: 'Missing or invalid id parameter' })
      }

      try {
        const updatedTemplate = await templates.updateTemplate(
          parseInt(id, 10),
          text
        )

        res.status(200)
        res.json(updatedTemplate)
      } catch (error) {
        console.error('Error updating template:', error)
        res.status(500).json({ error: 'Failed to update template' })
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
        await templates.deleteTemplate(parseInt(id, 10))

        res.status(200).json({ success: true, deletedId: parseInt(id, 10) })
      } catch (error) {
        console.error('Error deleting template:', error)
        res.status(500).json({ error: 'Failed to delete template' })
      }
    })
  )

  return router
}
