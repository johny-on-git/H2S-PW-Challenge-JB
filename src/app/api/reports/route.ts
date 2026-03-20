import { CreateReportSchema } from '../../../lib/validations/report';
import { db } from '../../../lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreateReportSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: result.error.issues 
      }), { status: 400 });
    }

    const reportId = crypto.randomUUID();

    // The Architect Output specifies we use PostGIS to check distance.
    await db.query(`
      INSERT INTO reports (id, category_id, location, description) 
      VALUES ($1, $2, ST_MakePoint($3, $4), $5)
    `, [
      reportId,
      result.data.categoryId,
      result.data.longitude,
      result.data.latitude,
      result.data.description || null
    ]);

    const redAlertTriggered = false;

    return new Response(JSON.stringify({
      success: true,
      reportId,
      redAlertTriggered
    }), { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal Server Error' 
    }), { status: 500 });
  }
}

export async function GET(_request: Request) {
  try {
    // In actual implementation, we would query the database for 
    // recent reports and active alerts (ST_Distance etc.)
    const reports = await db.query('SELECT * FROM reports ORDER BY created_at DESC LIMIT 50', []);
    const activeAlerts = await db.query('SELECT * FROM alerts WHERE resolved = false', []);

    return new Response(JSON.stringify({
      reports: reports.rows,
      activeAlerts: activeAlerts.rows
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal Server Error' 
    }), { status: 500 });
  }
}
