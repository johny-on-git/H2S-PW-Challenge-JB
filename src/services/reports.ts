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

// Mock in-memory store for reports
const reportsStore: Report[] = [];

export async function submitReport(input: ReportInput): Promise<{ success: boolean; data: Report }> {
  // Validate input
  const validated = ReportSchema.parse(input);

  const report: Report = {
    id: Math.random().toString(36).substring(7),
    ...validated,
    created_at: new Date(),
  };

  reportsStore.push(report);

  return {
    success: true,
    data: report,
  };
}

export async function getRecentReports(): Promise<Report[]> {
  // In a real app, this would query the DB.
  return [...reportsStore];
}

export function clearReports() {
  reportsStore.length = 0;
}
