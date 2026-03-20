import { describe, it, expect } from 'vitest';
import { CreateReportSchema } from '../lib/validations/report';

describe('CreateReportSchema', () => {
  it('should validate a correct report payload successfully', () => {
    const validData = {
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      latitude: 45.0,
      longitude: -90.0,
      reporterIdentifier: 'test@example.com',
      description: 'Pothole on main street',
      payload: { severity: 'high' }
    };

    const result = CreateReportSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when latitude is out of bounds', () => {
    const invalidData = {
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      latitude: 100.0, // Invalid: > 90
      longitude: 0.0,
    };

    const result = CreateReportSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail when longitude is out of bounds', () => {
    const invalidData = {
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      latitude: 0.0,
      longitude: 200.0, // Invalid: > 180
    };

    const result = CreateReportSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should pass when optional fields are missing', () => {
    const validData = {
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      latitude: 45.0,
      longitude: -90.0,
    };

    const result = CreateReportSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when categoryId is not a valid UUID', () => {
    const invalidData = {
      categoryId: 'invalid-id',
      latitude: 45.0,
      longitude: 0.0,
    };

    const result = CreateReportSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
