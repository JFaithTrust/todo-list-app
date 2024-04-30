import { z } from "zod"

export const TaskSchema = z.object({
  title: z.string().min(1),
  dueDate: z.date().optional(),
  category: z.string().min(1).max(13),
})