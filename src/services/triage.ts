export interface Report {
  lat: number;
  lng: number;
  categoryId: string;
  created_at: Date;
}

export interface TriageResult {
  alertTriggered: boolean;
  reportCount: number;
}

/**
 * Calculates the Haversine distance between two points in meters.
 */
function getDistance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function checkTriage(
  reports: Report[],
  categoryId: string,
  center: { lat: number; lng: number }
): Promise<TriageResult> {
  const now = new Date();
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  // Filter reports by category, time, and distance
  const relevantReports = reports.filter(r => {
    const isSameCategory = r.categoryId === categoryId;
    const isWithin12Hours = new Date(r.created_at) >= twelveHoursAgo;
    const isWithin500m = getDistance(center, { lat: r.lat, lng: r.lng }) <= 500;
    
    return isSameCategory && isWithin12Hours && isWithin500m;
  });

  return {
    alertTriggered: relevantReports.length >= 10,
    reportCount: relevantReports.length,
  };
}
