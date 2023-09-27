import { z } from 'zod';

export const condition = z.object({
  title: z.string().trim(),
  isPublic: z.boolean(),
  isPrivate: z.boolean(),
});

export type Condition = z.infer<typeof condition>;
