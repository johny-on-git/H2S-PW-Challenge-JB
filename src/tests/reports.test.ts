import { describe, it, expect, vi } from 'vitest';
import { submitReport } from '../services/reports';
import { z } from 'zod';

describe('Report Submission (US1-3)', () => {
  const validReport = {
    lat: 40.7128,
    lng: -74.0060,
    categoryId: 'safety',
    description: 'Gas leak detected'
  };

  it('should successfully submit a valid report', async () => {
    const result = await submitReport(validReport);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      id: expect.any(String),
      ...validReport
    });
  });

  it('should fail if coordinates are out of bounds', async () => {
    const invalidReport = { ...validReport, lat: 91 };
    await expect(submitReport(invalidReport)).rejects.toThrow();
  });

  it('should fail if category is missing', async () => {
    const invalidReport = { ...validReport, categoryId: '' };
    await expect(submitReport(invalidReport)).rejects.toThrow();
  });

  it('should pass with boundary coordinates (90, 180)', async () => {
    const boundaryReport = { ...validReport, lat: 90, lng: 180 };
    const result = await submitReport(boundaryReport);
    expect(result.success).toBe(true);
  });

  it('should fail if description is too long', async () => {
    const invalidReport = { ...validReport, description: 'a'.repeat(1001) };
    await expect(submitReport(invalidReport)).rejects.toThrow();
  });
});
