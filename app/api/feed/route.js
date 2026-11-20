import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import logic from '../../../lib/logic';

export const dynamic = 'force-dynamic';

// GET /api/feed -> profiles the user has not swiped on yet
export async function GET() {
  const profiles = logic.getFeed(db.loadProfiles(), db.loadState());
  return NextResponse.json({ profiles });
}
