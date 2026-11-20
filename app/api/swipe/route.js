import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import logic from '../../../lib/logic';

export const dynamic = 'force-dynamic';

// POST /api/swipe { profileId, direction: "like" | "pass" } -> { match, profile }
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const result = logic.applySwipe(db.loadProfiles(), db.loadState(), body?.profileId, body?.direction);
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  db.saveState(result.state);
  return NextResponse.json({ match: result.match, profile: result.profile });
}
