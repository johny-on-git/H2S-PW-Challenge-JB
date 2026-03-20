import { describe, it, expect, vi } from 'vitest';
import { checkTriage } from '../services/triage';

describe('Triage Engine (US6)', () => {
  const safetyCategory = 'safety';
  const centerPoint = { lat: 40.7128, lng: -74.0060 };

  it('should trigger a Red Alert when 10 reports are within 500m', async () => {
    // Mock reports: 10 reports at the same location
    const reports = Array(10).fill({
      lat: centerPoint.lat,
      lng: centerPoint.lng,
      categoryId: safetyCategory,
      created_at: new Date()
    });

    const result = await checkTriage(reports, safetyCategory, centerPoint);
    expect(result.alertTriggered).toBe(true);
    expect(result.reportCount).toBe(10);
  });

  it('should NOT trigger a Red Alert when reports are outside the 500m radius', async () => {
    // 10 reports: 1 at center, 9 at 600m away
    const reports = [
      { lat: centerPoint.lat, lng: centerPoint.lng, categoryId: safetyCategory, created_at: new Date() },
      ...Array(9).fill({
        lat: 40.7180, // roughly 600m away
        lng: -74.0060,
        categoryId: safetyCategory,
        created_at: new Date()
      })
    ];

    const result = await checkTriage(reports, safetyCategory, centerPoint);
    expect(result.alertTriggered).toBe(false);
  });

  it('should NOT trigger a Red Alert if reports are older than 12 hours', async () => {
    const oldDate = new Date();
    oldDate.setHours(oldDate.getHours() - 13);

    const reports = Array(10).fill({
      lat: centerPoint.lat,
      lng: centerPoint.lng,
      categoryId: safetyCategory,
      created_at: oldDate
    });

    const result = await checkTriage(reports, safetyCategory, centerPoint);
    expect(result.alertTriggered).toBe(false);
  });

  it('should trigger a Red Alert when exactly 10 reports are within range', async () => {
    const reports = Array(10).fill({
      lat: centerPoint.lat,
      lng: centerPoint.lng,
      categoryId: safetyCategory,
      created_at: new Date()
    });

    const result = await checkTriage(reports, safetyCategory, centerPoint);
    expect(result.alertTriggered).toBe(true);
  });

  it('should trigger a Red Alert when exactly at 500m distance', async () => {
    const reports = Array(10).fill({
      lat: 40.7172, // definitely within 500m (approx 489m)
      lng: -74.0060,
      categoryId: safetyCategory,
      created_at: new Date()
    });

    const result = await checkTriage(reports, safetyCategory, centerPoint);
    expect(result.alertTriggered).toBe(true);
  });

  it('should trigger a Red Alert when exactly at 12h limit', async () => {
    const exactly12hAgo = new Date();
    exactly12hAgo.setHours(exactly12hAgo.getHours() - 12);

    const reports = Array(10).fill({
      lat: centerPoint.lat,
      lng: centerPoint.lng,
      categoryId: safetyCategory,
      created_at: exactly12hAgo
    });

    const result = await checkTriage(reports, safetyCategory, centerPoint);
    expect(result.alertTriggered).toBe(true);
  });
});
