import { describe, it, expect, vi } from 'vitest';
import { POST } from '../app/api/reports/route';

// Mock DB interactions for test isolation
vi.mock('../lib/db', () => ({
  db: {
    query: vi.fn(() => Promise.resolve({ rows: [] })),
  }
}));

describe('POST /api/reports', () => {
  it('should return 400 for invalid payload', async () => {
    const request = new Request('http://localhost/api/reports', {
      method: 'POST',
      body: JSON.stringify({ invalidField: true })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should ingest a citizen report successfully and handle false red alert', async () => {
    // We override db.query specifically if needed, but here we assume no alert triggered
    const validPayload = {
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      latitude: 45.0,
      longitude: -90.0
    };

    const request = new Request('http://localhost/api/reports', {
      method: 'POST',
      body: JSON.stringify(validPayload)
    });

    // Assume db.query resolves with dummy id and red_alert false in the mocked module inside route handler
    const response = await POST(request);
    
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.reportId).toBeDefined();
    expect(data.redAlertTriggered).toBe(false);
  });
});

describe('GET /api/reports', () => {
  it('should return reports and active alerts successfully', async () => {
    // Mocking the DB module is already set up at the top
    const request = new Request('http://localhost/api/reports', {
      method: 'GET'
    });

    const { GET } = await import('../app/api/reports/route');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('reports');
    expect(data).toHaveProperty('activeAlerts');
    expect(Array.isArray(data.reports)).toBe(true);
    expect(Array.isArray(data.activeAlerts)).toBe(true);
  });

  it('should return 500 when database query fails', async () => {
    // We import db directly to spy on it
    const { db } = await import('../lib/db');
    const querySpy = vi.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB Error'));
    
    // We need to re-import GET to ensure it uses the mocked db if not already
    const { GET } = await import('../app/api/reports/route');
    const response = await GET(new Request('http://localhost/api/reports'));
    
    expect(response.status).toBe(500);
    querySpy.mockRestore();
  });
});

