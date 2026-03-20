import { z } from 'zod';

// Schema for report submission
export const ReportSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  categoryId: z.string().min(1),
  description: z.string().max(1000).optional(),
});

export type ReportInput = z.infer<typeof ReportSchema>;

export interface Report extends ReportInput {
  id: string;
  created_at: Date;
}

export async function submitReport(input: ReportInput): Promise<{ success: boolean; data: Report }> {
  // Validate input
  const validated = ReportSchema.parse(input);

  // In a real app, this would save to the DB.
  // For TDD, we'll return a mock saved object.
  const report: Report = {
    id: Math.random().toString(36).substring(7),
    ...validated,
    created_at: new Date(),
  };

  return {
    success: true,
    data: report,
  };
}
