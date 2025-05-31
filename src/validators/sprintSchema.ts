import { z } from 'zod';

export const SprintBodySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(5, 'Title is required'),
});

export const SprintQuerySchema = z.object({
  id: z.coerce.string().min(1, 'ID is required'),
});


export type SprintBodyInput = z.infer<typeof SprintBodySchema>;
export type SprintQueryInput = z.infer<typeof SprintQuerySchema>;
