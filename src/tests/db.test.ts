import { describe, it, expect, vi } from 'vitest';
import { db } from '../lib/db';

describe('Database Abstraction', () => {
  it('should have a query method', () => {
    expect(db.query).toBeDefined();
    expect(typeof db.query).toBe('function');
  });

  it('should return empty rows by default', async () => {
    const result = await db.query('SELECT * FROM test', []);
    expect(result).toEqual({ rows: [] });
  });

  it('should accept parameters without error', async () => {
    await expect(db.query('SELECT $1', ['test'])).resolves.toEqual({ rows: [] });
  });

  it('should handle multiple calls', async () => {
    const querySpy = vi.spyOn(db, 'query');
    await db.query('Q1', []);
    await db.query('Q2', []);
    expect(querySpy).toHaveBeenCalledTimes(2);
    querySpy.mockRestore();
  });
});
