import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'
import {
  TemplateQuerySchema,
  CreateTemplateBodySchema,
  UpdateTemplateBodySchema,
} from '@/validators/templateSchema'

export default (db: Database) => {
  const templates = buildRespository(db)
  const router = Router()

  router.post(
    '/',
    jsonRoute(async (req, res) => {
      const parseResult = CreateTemplateBodySchema.safeParse(req.body)

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid input',
          details: parseResult.error.format(),
        })
      }

      const { text } = parseResult.data

      try {
        const template = await templates.createTemplate(text)

        return res.status(200).json({
          createdID: template?.id,
          text: template?.text,
        })
      } catch (error) {
        console.log('Error creating template:', error) // Log for debugging
        return res.status(500).json({ error: 'Failed to create template' }) // Better status & message
      }
    })
  )

  router.get(
    '/',
    jsonRoute(async (req, res) => {
      const parseResult = TemplateQuerySchema.safeParse(req.query)

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid query',
          details: parseResult.error.format(),
        })
      }

      const { id } = parseResult.data

      try {
        const template = await templates.getByID(id)

        if (!template) {
          return res.status(404).json({ error: 'Template not found' })
        }

        return res.status(200).json(template)
      } catch (error) {
        console.error('Error fetching template:', error)
        return res.status(500).json({ error: 'Failed to get template' })
      }
    })
  )

  router.patch(
    '/',
    jsonRoute(async (req, res) => {
      const parseResult = UpdateTemplateBodySchema.safeParse(req.body)

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid input',
          details: parseResult.error.format(),
        })
      }

      const { id, text } = parseResult.data

      try {
        const updatedTemplate = await templates.updateTemplate(id, text)

        return res.status(200).json(updatedTemplate)
      } catch (error) {
        console.error('Error updating template:', error)
        return res.status(500).json({ error: 'Failed to update template' })
      }
    })
  )

  router.delete(
    '/',
    jsonRoute(async (req, res) => {
      const parseResult = TemplateQuerySchema.safeParse(req.query)

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid query',
          details: parseResult.error.format(),
        })
      }

      const { id } = parseResult.data

      try {
        await templates.deleteTemplate(id)

        return res.status(200).json({ success: true, deletedId: id })
      } catch (error) {
        console.error('Error deleting template:', error)
        return res.status(500).json({ error: 'Failed to delete template' })
      }
    })
  )

  return router
}
