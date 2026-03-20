import { z } from 'zod';

export const CreateReportSchema = z.object({
  categoryId: z.string().uuid(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  reporterIdentifier: z.string().optional(),
  description: z.string().optional(),
  payload: z.record(z.string(), z.any()).optional(),
});

export type CreateReportPayload = z.infer<typeof CreateReportSchema>;
