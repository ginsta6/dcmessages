import { z } from 'zod';

// POST /
export const CreateMessageInputSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  sprintID: z.string().min(1, 'Sprint ID is required'),
});

// GET /
export const GetMessagesQuerySchema = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  page: z.string().optional(),
  username: z.string().optional(),
  sprint: z.string().optional(),
});

export type CreateMessageInput = z.infer<typeof CreateMessageInputSchema>;
export type GetMessagesQueryInput = z.infer<typeof GetMessagesQuerySchema>;
