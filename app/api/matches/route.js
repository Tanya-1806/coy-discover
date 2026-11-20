import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import logic from '../../../lib/logic';

export const dynamic = 'force-dynamic';

// GET /api/matches -> mutual matches only
export async function GET() {
  return NextResponse.json({ matches: logic.getMatches(db.loadProfiles(), db.loadState()) });
}
