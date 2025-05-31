import { z } from 'zod'

export const TemplateQuerySchema = z.object({
  id: z.coerce.number().int().min(1),
})

export const CreateTemplateBodySchema = z.object({
    text: z.string().min(5, 'Text is required')
})

export const UpdateTemplateBodySchema = z.object({
    id: z.coerce.number().int().min(1, 'ID is required'),
    text: z.string().min(5, 'Text is required')
})

export type TemplateQueryInput = z.infer<typeof TemplateQuerySchema>
export type CreateTemplateBodyInput = z.infer<typeof CreateTemplateBodySchema>
export type UpdateTemplateBodyInput = z.infer<typeof UpdateTemplateBodySchema>
